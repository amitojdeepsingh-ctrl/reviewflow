-- Sample customers for ADS Immigration (run this in Supabase SQL Editor)

-- First get your user ID from auth.users
-- Then insert customers (replace with your actual user_id)

-- INSERT INTO public.customers (user_id, name, phone, email, address, notes)
-- VALUES 
-- ('YOUR_USER_ID', 'John Smith', '+14155551234', 'john.smith@email.com', 'Toronto, ON', 'Visa application'),
-- ('YOUR_USER_ID', 'Maria Garcia', '+14155552345', 'maria.g@email.com', 'Mississauga, ON', 'PR application'),
-- ('YOUR_USER_ID', 'Raj Patel', '+14155553456', 'raj.patel@email.com', 'Brampton, ON', 'Work permit'),
-- ('YOUR_USER_ID', 'Sarah Johnson', '+14155554567', 'sarah.j@email.com', 'Scarborough, ON', 'Student visa'),
-- ('YOUR_USER_ID', 'Ahmed Hassan', '+14155555678', 'ahmed.h@email.com', 'North York, ON', 'Citizenship');

-- Sample reviews
-- INSERT INTO public.reviews (user_id, customer_id, platform, rating, content, review_date, responded)
-- VALUES 
-- ('YOUR_USER_ID', 'CUSTOMER_UUID', 'google', 5, 'Excellent service! Got my PR in 3 months. Highly recommend!', '2026-05-08', false),
-- ('YOUR_USER_ID', 'CUSTOMER_UUID', 'google', 2, 'Slow response times, not satisfied with the service.', '2026-05-05', false);