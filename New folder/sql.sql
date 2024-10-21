use `election`;
select * from `users`;
select * from `votes`;
select * from `parties`;
select * from `regions`;
select * from `adminlogs`;
select 	* from `servererrors`;
select * from `ErrorCodes`;
select * from `securityerrors`;
select * from `userlogs`;
select * from `election_officers`;
select * from `electionofficerlogs`;







Rithik Mehta 
222VMTR00596
HYDERBED 
Hyderabad 
2024-09-09 00:45:59
https://res-console.cloudinary.com/dr4krsosv/media_explorer_thumbnails/9ed3ea4d8aef667c40ce183022188840/detailed


INSERT INTO ErrorCodes (code, description) VALUES
('ERR001', 'Invalid input provided'),
('ERR002', 'Authentication failed'),
('ERR003', 'Permission denied'),
('ERR004', 'Resource not found'),
('ERR005', 'Server error'),
('ERR006', 'Database connection failed'),
('ERR007', 'Security breach detected'),
('ERR008', 'Timeout occurred'),
('ERR009', 'Data validation error'),
('ERR010', 'Rate limit exceeded');