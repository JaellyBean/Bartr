-- Function to get nearby users based on location and skills
CREATE OR REPLACE FUNCTION get_nearby_users(
  p_lat double precision,
  p_lng double precision,
  p_radius_meters integer DEFAULT 50000,
  p_required_skills text[] DEFAULT NULL
)
RETURNS TABLE(
  id uuid,
  full_name text,
  bio text,
  skills text[],
  lat double precision,
  lng double precision,
  dist_meters double precision
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.full_name,
    p.bio,
    p.skills,
    ST_Y(p.location::geometry) as lat,
    ST_X(p.location::geometry) as lng,
    ST_Distance(
      ST_Point(p_lng, p_lat)::geography,
      p.location::geography
    ) as dist_meters
  FROM profiles p
  WHERE
    p.lat IS NOT NULL
    AND p.lng IS NOT NULL
    AND ST_DWithin(
      ST_Point(p_lng, p_lat)::geography,
      ST_Point(p.lng, p.lat)::geography,
      p_radius_meters
    )
    AND (
      p_required_skills IS NULL
      OR p.skills && p_required_skills
    )
    AND p.id != auth.uid()  -- Exclude current user
  ORDER BY dist_meters;
END;
$$;