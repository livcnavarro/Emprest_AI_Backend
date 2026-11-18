ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loans ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.equipment, public.profiles, public.loans
FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.equipment, public.profiles, public.loans
TO authenticated;

CREATE POLICY equipment_authenticated_read
ON public.equipment
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY profiles_read_self
ON public.profiles
FOR SELECT
TO authenticated
USING ((SELECT auth.uid()) = auth_user_id);

CREATE POLICY loans_read_owner_or_operations
ON public.loans
FOR SELECT
TO authenticated
USING (
  auth_user_id = (SELECT auth.uid())
  OR (
    returned_at IS NULL
    AND EXISTS (
      SELECT 1
      FROM public.profiles AS profile
      WHERE profile.auth_user_id = (SELECT auth.uid())
        AND profile.role = 'Operações'::public.profile_role
    )
  )
);

CREATE OR REPLACE FUNCTION public.request_loan(p_equipment_patrimony text)
RETURNS TABLE (
  outcome text,
  loan_id uuid,
  created_at timestamptz,
  due_date date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, auth
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_today date := (statement_timestamp() AT TIME ZONE 'America/Sao_Paulo')::date;
  v_equipment_status public.equipment_status;
  v_open_count integer;
  v_due_date date;
  v_loan_id uuid;
  v_created_at timestamptz;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT 'UNAUTHENTICATED'::text, NULL::uuid, NULL::timestamptz, NULL::date;
    RETURN;
  END IF;

  PERFORM 1
  FROM public.profiles AS profile
  WHERE profile.auth_user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'PROFILE_NOT_FOUND'::text, NULL::uuid, NULL::timestamptz, NULL::date;
    RETURN;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.loans AS loan
    WHERE loan.auth_user_id = v_user_id
      AND loan.returned_at IS NULL
      AND loan.due_date < v_today
  ) THEN
    RETURN QUERY SELECT 'OVERDUE_LOAN'::text, NULL::uuid, NULL::timestamptz, NULL::date;
    RETURN;
  END IF;

  SELECT count(*)::integer
  INTO v_open_count
  FROM public.loans AS loan
  WHERE loan.auth_user_id = v_user_id
    AND loan.returned_at IS NULL;

  IF v_open_count >= 3 THEN
    RETURN QUERY SELECT 'LIMIT_REACHED'::text, NULL::uuid, NULL::timestamptz, NULL::date;
    RETURN;
  END IF;

  SELECT equipment.status
  INTO v_equipment_status
  FROM public.equipment AS equipment
  WHERE equipment.patrimony = p_equipment_patrimony
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT 'EQUIPMENT_NOT_FOUND'::text, NULL::uuid, NULL::timestamptz, NULL::date;
    RETURN;
  END IF;

  IF v_equipment_status <> 'Disponível'::public.equipment_status
    OR EXISTS (
      SELECT 1
      FROM public.loans AS loan
      WHERE loan.equipment_patrimony = p_equipment_patrimony
        AND loan.returned_at IS NULL
    )
  THEN
    RETURN QUERY SELECT 'EQUIPMENT_UNAVAILABLE'::text, NULL::uuid, NULL::timestamptz, NULL::date;
    RETURN;
  END IF;

  v_due_date := v_today + 14;

  INSERT INTO public.loans (
    id,
    auth_user_id,
    equipment_patrimony,
    due_date
  )
  VALUES (
    gen_random_uuid(),
    v_user_id,
    p_equipment_patrimony,
    v_due_date
  )
  RETURNING id, created_at INTO v_loan_id, v_created_at;

  UPDATE public.equipment
  SET status = 'Emprestado'::public.equipment_status
  WHERE patrimony = p_equipment_patrimony
    AND status = 'Disponível'::public.equipment_status;

  IF NOT FOUND THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'LOAN_CREATION_CONFLICT';
  END IF;

  RETURN QUERY SELECT 'CREATED'::text, v_loan_id, v_created_at, v_due_date;
END;
$function$;

REVOKE ALL ON FUNCTION public.request_loan(text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_loan(text) TO authenticated;
