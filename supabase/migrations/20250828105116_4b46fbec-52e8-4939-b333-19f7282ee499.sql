-- Insert sample claims for demonstration
DO $$
DECLARE
    user_id_var uuid;
    topic_id_1 uuid;
    topic_id_2 uuid;
    topic_id_3 uuid;
    claim_id_1 uuid;
    claim_id_2 uuid;
    claim_id_3 uuid;
    claim_id_4 uuid;
    claim_id_5 uuid;
BEGIN
    -- Get a user ID (create one if none exists)
    SELECT id INTO user_id_var FROM auth.users LIMIT 1;
    
    IF user_id_var IS NULL THEN
        -- If no users exist, we'll use a placeholder UUID
        user_id_var := '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- Get some topic IDs
    SELECT id INTO topic_id_1 FROM topics WHERE name = 'Breaking News' LIMIT 1;
    SELECT id INTO topic_id_2 FROM topics WHERE name = 'Health & Safety' LIMIT 1;
    SELECT id INTO topic_id_3 FROM topics WHERE name = 'Technology' LIMIT 1;

    -- Insert sample claims
    INSERT INTO claims (id, user_id, content, verification_status, confidence_score, urgency, image_url, location, is_new) VALUES
    (gen_random_uuid(), user_id_var, 'Breaking: New emergency shelter locations confirmed by local authorities. Three additional sites now operational with capacity for 500+ evacuees.', 'verified', 96, 'high', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600', 'Metropolitan Area', true),
    (gen_random_uuid(), user_id_var, 'ALERT: Claims about contaminated water supply spreading on social media. Health department confirms testing shows water is SAFE in 90% of city areas.', 'false', 89, 'critical', 'https://images.unsplash.com/photo-1548193545-cc474ca26f3b?w=800&h=600', 'Downtown District', true),
    (gen_random_uuid(), user_id_var, 'Reports suggest major tech companies are implementing new AI safety protocols following recent developments in artificial intelligence.', 'investigating', 67, 'medium', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600', 'Global', false),
    (gen_random_uuid(), user_id_var, 'Local hospital announces new COVID-19 testing procedures. Updated guidelines now available for walk-in testing with reduced wait times.', 'verified', 94, 'medium', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600', 'City Medical Center', false),
    (gen_random_uuid(), user_id_var, 'Unconfirmed reports of supply chain disruptions affecting grocery stores. Officials working to verify accuracy of these claims.', 'pending', 45, 'low', NULL, 'Regional', true)
    RETURNING id INTO claim_id_1;

    -- Get the actual claim IDs that were inserted
    SELECT id INTO claim_id_1 FROM claims WHERE content LIKE 'Breaking: New emergency%' LIMIT 1;
    SELECT id INTO claim_id_2 FROM claims WHERE content LIKE 'ALERT: Claims about contaminated%' LIMIT 1;
    SELECT id INTO claim_id_3 FROM claims WHERE content LIKE 'Reports suggest major tech%' LIMIT 1;
    SELECT id INTO claim_id_4 FROM claims WHERE content LIKE 'Local hospital announces%' LIMIT 1;
    SELECT id INTO claim_id_5 FROM claims WHERE content LIKE 'Unconfirmed reports of supply%' LIMIT 1;

    -- Link claims to topics
    IF topic_id_1 IS NOT NULL AND claim_id_1 IS NOT NULL THEN
        INSERT INTO claim_topics (claim_id, topic_id) VALUES (claim_id_1, topic_id_1) ON CONFLICT DO NOTHING;
    END IF;
    
    IF topic_id_2 IS NOT NULL AND claim_id_2 IS NOT NULL THEN
        INSERT INTO claim_topics (claim_id, topic_id) VALUES (claim_id_2, topic_id_2) ON CONFLICT DO NOTHING;
    END IF;
    
    IF topic_id_3 IS NOT NULL AND claim_id_3 IS NOT NULL THEN
        INSERT INTO claim_topics (claim_id, topic_id) VALUES (claim_id_3, topic_id_3) ON CONFLICT DO NOTHING;
    END IF;
    
    IF topic_id_2 IS NOT NULL AND claim_id_4 IS NOT NULL THEN
        INSERT INTO claim_topics (claim_id, topic_id) VALUES (claim_id_4, topic_id_2) ON CONFLICT DO NOTHING;
    END IF;

    -- Insert some sample reactions
    IF claim_id_1 IS NOT NULL THEN
        INSERT INTO reactions (user_id, claim_id, reaction_type) VALUES 
        (user_id_var, claim_id_1, 'like') ON CONFLICT DO NOTHING;
    END IF;

    -- Insert sample comments
    IF claim_id_1 IS NOT NULL THEN
        INSERT INTO comments (user_id, claim_id, content) VALUES 
        (user_id_var, claim_id_1, 'Thank you for sharing this verified information!') ON CONFLICT DO NOTHING;
    END IF;

END $$;