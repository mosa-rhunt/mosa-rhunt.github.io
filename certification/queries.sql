
SELECT 
q.formquestionnum,
q.sort,
q.question,
q.type AS [response_type],
q.required,
isnull(q.pagename, '') as pagename,
isnull(q.pagedescription, '') as pagedescription,
q.opentext1, q.opentext2, q.opentext3, q.opentext4, q.opentext5, q.opentext6, q.opentext7, q.opentext8, q.opentext9, q.opentext10, 
q.opentext11, q.opentext12, q.opentext13, q.opentext14, q.opentext15, q.opentext16, q.opentext17, q.opentext18, q.opentext19, q.opentext20, 
q.opentext21, q.opentext22, q.opentext23, q.opentext24, q.opentext25, q.opentext26, q.opentext27, q.opentext28, q.opentext29, q.opentext30, 
q.opentext31, q.opentext32, q.opentext33, q.opentext34, q.opentext35, q.opentext36, q.opentext37, q.opentext38, q.opentext39, q.opentext40, 
q.opentext41, q.opentext42, q.opentext43, q.opentext44, q.opentext45, q.opentext46, q.opentext47, q.opentext48, q.opentext49, q.opentext50
FROM FormQuestions q 
WHERE q.formnum = 105
ORDER BY q.sort


LEFT JOIN DropDownLists l ON q.DropDownNum = l.DropDownNum


SELECT 
r.formquestionnum, 
u.type, 
r.opentext1, r.opentext2, r.opentext3, r.opentext4, r.opentext5, r.opentext6, r.opentext7, r.opentext8, r.opentext9, r.opentext10, 
r.opentext11, r.opentext12, r.opentext13, r.opentext14, r.opentext15, r.opentext16, r.opentext17, r.opentext18, r.opentext19, r.opentext20, 
r.opentext21, r.opentext22, r.opentext23, r.opentext24, r.opentext25, r.opentext26, r.opentext27, r.opentext28, r.opentext29, r.opentext30, 
r.opentext31, r.opentext32, r.opentext33, r.opentext34, r.opentext35, r.opentext36, r.opentext37, r.opentext38, r.opentext39, r.opentext40, 
r.opentext41, r.opentext42, r.opentext43, r.opentext44, r.opentext45, r.opentext46, r.opentext47, r.opentext48, r.opentext49, r.opentext50
FROM formused u JOIN formresults r ON r.formusednum = u.formusednum
WHERE u.customerallnum = #CustomerAllNum#
AND u.type IN ('2020', '2021', '2022')
AND u.status = 'Active'
AND r.formquestionnum <> ''
AND u.formnum = 105



SELECT
'' AS formquestionnum,
i.inventorytab,
i.type,

FROM inventory i
WHERE i.customernum = #CustomerAllNum#
AND i.type IN ('2020', '2021', '2022')
AND i.status = 'Active'
AND i.inventorytab = ''
ORDER BY i.type, i.sort


-- FARM OSP

-- Q#71 (num2474) Crop Rotation
OpenText64 AS [Rotation 1],
OpenText75 AS [Rotation 1 cover crop/ plowdow],
OpenText65 AS [Rotation 2],
OpenText30 AS [Rotation 2 cover crop/ plowdow],
OpenText66 AS [Rotation 3],
OpenText40 AS [Rotation 3 cover crop/ plowdow],

-- Q#106 (num2595) Adjoining Land Use Buffers
OpenText84 AS [Adjoining land manager],
OpenText68 AS [Adjoining land use],
OpenText69 AS [Do you harvest crop from this buffer?],
OpenText7 AS [Field ID],
OpenText99 AS [How is contamination prevented in this area?],
OpenText70 AS [If buffer, what is the width?],
OpenText72 AS [If harvested, describe sale or use of crop],
OpenText71 AS [If VALU, list the expiration date],

-- Q#122 (num2724) Equipment List
OpenText76 AS [Custom?],
OpenText77 AS [For organic use only?],
OpenText78 AS [If also used for conventional, transitional, or buffer crops how is it cleaned],
OpenText74 AS [Own or rent?],
OpenText73 AS [Type of equipment],

-- Q#138 (num2655) Crop Storage
OpenText82 AS [Capacity],
OpenText83 AS [Organic Status of crops stored],
OpenText80 AS [Storage ID],
OpenText79 AS [Type of crops stored],
OpenText81 AS [Type of storage],





SELECT
customernum as [id],
status,
custtype,
company,
firstname,
lastname,
email,
address1,
address2,
city,
state,
zip,
opentext6 as [mailing_address1],
opentext7 as [mailing_address2],
opentext16 as [mailing_city],
opentext20 as [mailing_state],
opentext12 as [mailing_zip],
opentext19 as [website],
opentext1056 as [tax_id],
opentext1101 as [doing_business_as],
opentext1081 as [communication_method],
opentext1060 as [certificate_effective_date],
opentext1059 as [certified_products],
opentext1096 as [notes_to_initial_reviewer],
opentext1098 as [residue_test_2022],
opentext1047 as [test_account],
opentext1032 as [farm],
opentext1040 as [handler],
opentext1045 as [retail],
opentext1042 as [livestock],
opentext1022 as [apiculture],
opentext1039 as [greenhouse],
opentext1044 as [mushroom],
opentext1043 as [maple_syrup],
opentext1046 as [sprout],
opentext1048 as [wild_crop],
opentext1013 as [grassfed_dairy],
opentext1106 as [grassfed_dairy_handling],
opentext1033 as [grassfed_meat],
opentext1003 as [grassfed_meat_handling],
opentext1104 as [livestock_sales_facility],
(SELECT firstname + ' ' + lastname FROM users WHERE usernum = opentext1052) as [this_year_inspector],
(SELECT firstname + ' ' + lastname FROM users WHERE usernum = opentext1031) as [last_year_inspector]
FROM Customers
WHERE CustomerNum = #CustomerAllNum#









SELECT 
Id,
FileType,
FileClass,
Name,
Description,
Status,
CreateDate,
CloudLink,
CASE WHEN f.UserNum = #CustomerAllNum# THEN 'Contact'
ELSE u.FirstName + ' ' + u.LastName END AS [User]
FROM Files f JOIN Users u ON f.UserNum = u.UserNum
WHERE CustomerNum = #CustomerAllNum#
ORDER BY Status







select * from information_schema.columns where table_name = 'CustomerDisplay'


SELECT table_name,
column_name, 
data_type,
is_nullable,
character_maximum_length
FROM information_schema.columns
WHERE table_name = 'FieldNames'
ORDER BY table_name, column_name






(
SELECT COUNT(*)
FROM Events
WHERE AssignedTo = #mainTable#.UserNum
AND Name LIKE '%' + CAST(YEAR(GETDATE()) AS VARCHAR) + '%'
AND Status = 'Complete'
)


(
SELECT COUNT(*)
FROM Customers 
WHERE OpenText1052 = #mainTable#.UserNum
AND Status IN ('Active', 'Pending')
AND (dbo.MOSAGetNextStepByCust(CustomerNum) LIKE '3[d-f]%'
OR dbo.MOSAGetNextStepByCust(CustomerNum) LIKE '[45]%')
)








INSPECTOR CAPACTIY

Inspectors (Users)
location
scope(s)

SELECT
UserNum,
Name,
Address,
WorkPhone,
HomePhone,
MobilePhone,
Email,
Department,
OpenText3 AS [Endorsed Categories],
OpenText10 AS [Training],
OpenText2 AS [Education],
OpenText4 AS [Experience],
OpenText5 AS [Crop],
OpenText6 AS [Livestock],
OpenText7 AS [Handler],
FROM Users u 
WHERE Status = 'Active'
AND GroupNum = 19


Clients
location
scope(s)
WGDF

SELECT TOP 10
CustomerNum,
Address1,
Address2,
City,
State,
Zip,
OpenText6 AS [Mailing Address1],
OpenText7 AS [Mailing Address2],
OpenText16 AS [Mailing City],
OpenText20 AS [Mailing State],
OpenText12 AS [Mailing Zip],
OpenText1059 AS [Certified Products/Services],
OpenText1032 AS [Farm],
OpenText1022 AS [Apiculture],
OpenText1039 AS [Greenhouse],
OpenText1040 AS [Handler],
OpenText1042 AS [Livestock],
OpenText1043 AS [Maple Syrup],
OpenText1044 AS [Mushroom],
OpenText1045 AS [Retail],
OpenText1090 AS [Sprout],
OpenText1048 AS [Wild Crop],
OpenText1104 AS [Livestock Sales Facility],
OpenText1013 AS [GrassFed Dairy],
OpenText1033 AS [GrassFed Meat],
OpenText1106 AS [GrassFed Dairy Handling],
OpenText1003 AS [GrassFed Meat Handling],
OpenText1103 AS [Residue Test 2021],
OpenText1098 AS [Residue Test 2022]
FROM Customers c 
WHERE Status IN ('Active', 'Pending')
AND OpenText1047 <> 'Yes'
ORDER BY CustomerNum


Inspection Events

SELECT
AssignedTo,
EventNum,
Name,
Type AS [Inspection Type],
OpenText78 AS [Inspection Date],
EventStartTime,
EventEndTime
FROM Events e 
WHERE Status IN ('Pending', 'Scheduled', 'Completed')
AND Type LIKE 'Inspection%'



















SELECT 
c.customernum,
u.name AS team,
dbo.MOSAGetNextStepByCust(c.customernum) AS [WGDF],
dbo.MOSAGetNextStepByCustLastYear(c.customernum) AS [WGDF Last Year]
FROM customers c JOIN users u on c.assignedto = u.usernum
WHERE c.status = 'Active'
AND c.OpenText1047 <> 'Yes'
AND c.customernum < 100




SELECT 
e.eventnum,
e.customerallnum,
e.name AS [event_name],
