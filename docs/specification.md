# CRUD

III patron record variable-length field b [BARCODE] (aka Student ID) is composed of a library-standard patron prefix "22091" + a 3-digit school system code (St Paul Public School = "600") + a 6-digit student-specific id.
APATID/SSN is ultimately optional
APATID/SSN for St Paul Public school is 6-digit student-specific id only
APATID/SSN for non-St Paul Public school is 1-letter prefix + 6-digit student-specific id only

Duplicate accounts are OK.

There is no staff data extract.

## COMPARE SCHOOL AND ILS EXTRACTS
Comparison is made on ID

## CREATE PATRON 
When school extract is compared against ILS extract, new APATID/SSN appears in the school extract -> new patron should be created in the ILS

## UPDATE PATRON
Changes when ILS extract differs from school extract in any of the following field values
Name
Address
Grade
Enrolled/Not Enrolled

## DELETE PATRON
### Current practice (as of 2018-07-01)
1. Expiration dates are set to 9/30 of the next school year. (e.g., a patron seen in the school extract 2018-10-31 would have an expiration date of 2019-09-30)
1. At the beginning of the new school year, the template is changed (by Cindy) to have the next year’s expiration date.
1. They remain in the system, expired, indefinitely…
### SPPL would like to add
1. In October each year, purge all Library Go records that have expiration dates that are 2-years-old or older.
### Other possibilities
1. Have Mary Cooper send us codes of E=enrolled, W or G= withdrawn or graduated. Have cards expire when this code is sent. SPPL decided this work is not necessary and the process can continue to use the expiration dates as they are given to us from schools
### Another thought
1. SPPL would like to communicate that expired Library Go records can be used for up to 6-months to make a physical card for graduated/withdrawn students.  (How to communicate this?) 

## Sierra load profile information

```
                     Data Not Overlaid    (m2btab.pschools)
     RECORD TYPE          FIELD NAME

01 > PATRON               (0)
02 > PATRON               FAMILY ID(1)
03 > PATRON               (2)
04 > PATRON               (3)
05 > PATRON               (4)
06 > PATRON               BOOKING(5)
07 > PATRON               (6)
08 > PATRON               (7)
09 > PATRON               HOLD(8)
10 > PATRON               FINE(9)
11 > PATRON               PIN(=)
12 > PATRON               HOLD CODE(c)
13 > PATRON               MESSAGE(m)
14 > PATRON               TELEPHONE2(p(:d))
15 > PATRON               TELEPHONE(t(:d))
16 > PATRON               EMAIL ADDR(z(:d))
17 > PATRON               <PSCAT>
18 > PATRON               <PATCAT>
19 > PATRON               <TOT CHKOUT>
20 > PATRON               <TOT RENWAL>
21 > PATRON               <CUR CHKOUT>
22 > PATRON               <HOME LIBR>
23 > PATRON               <PMESSAGE>
24 > PATRON               <HLODUES>
25 > PATRON               <MBLOCK>
26 > PATRON               <CL RTRND>
27 > PATRON               <MONEY OWED>
28 > PATRON               <VIDEOS>
29 > PATRON               <BONCS>
30 > PATRON               <ILL REQUES>
31 > PATRON               <DEBIT BAL>
32 > PATRON               <PASSES>
33 > PATRON               <CDS>
34 > PATRON               <CIRCACTIVE>
35 > PATRON               <NOTICE PREF>

                  PATRON record for Schools  (m2btab.pschools)
     RECORD TYPE          FIELD NAME           MARC TAG   SUBFIELDS           

01 > PATRON               <CIRCACTIVE>         079        a                   
02 > PATRON               <EXP DATE>           080        a                   
03 > PATRON               <PCODE1>             081        a                   
04 > PATRON               <PCODE2>             082        a                   
05 > PATRON               <PSCAT>              083        a                   
06 > PATRON               <PATCAT>             084        a                   
07 > PATRON               <HOME LIBR>          085        a                   
08 > PATRON               <MBLOCK>             086        a                   
09 > PATRON               <PMESSAGE>           087        a                   
10 > PATRON               <BIRTH DATE>         089        a                   
11 > PATRON               APATID/SSN(u)        020        ALL                 
12 > PATRON               P BARCODE(b)         030        ALL                 
13 > PATRON               PATRN NAME(n)        100        ALL                 
14 > PATRON               ADDRESS(a)           220        ALL                 
15 > PATRON               TELEPHONE(t)         225        ALL                 
16 > PATRON               ADDRESS2(h)          230        ALL                 
17 > PATRON               TELEPHONE2(p)        235        ALL                 
18 > PATRON               MESSAGE(m)           400        ALL                 
19 > PATRON               NOTE(x)              500        ALL                 
20 > PATRON               SCHOOL(e)            501        ALL                 
21 > PATRON               GRADE(f)             502        ALL                 
22 > PATRON               STATUS(g)            503        ALL                 
23 > PATRON               EMAIL ADDR(z)        550        ALL                 
24 > PATRON               PIN(=)               600        a                   
25 > PATRON               HOLD CODE(c)         800        ALL                 
26 > PATRON               DOB(d)               801        ALL                 
```

## Crosswalk

|CONTENT|patreon_scheme valid regexp|IC EXTRACT COLUMN|SIERRA SPPL FIELD NAME|SIERRA SPPL FIELD TAG/CODE|SIERRA API PATRONUPDATE|
|-------|---------------------------|-----------------|----------------------|--------------------------|-----------------------|
|library patron card number|`^220916\d{8}$`|1|P BARCODE|b|PatronPatch->barcodes[]|
|student id|`^\d{6}$`|2|STUDENTID APATID/SSN|u|??? PatronPatch->uniqueIds[]|
|patron name||3|PATRN NAME|n|PatronPatch->names[]|
|patron address||4|ADDRESS|a|PatronPatch->addresses[{lines[],type:a}]|
|patron telephone||5|TELEPHONE|t|PatronPatch->phones[{number,type:t}]|
|patron email address||6|EMAIL ADDR|z|PatronPatch->emails[]|
|patron birth date||7|BIRTH DATE|51|PatronPatch->birthDate|
|patron pin||8|PIN|=|PatronPatch->pin|
|patron school name||9|SCHOOL|e|PatronPatch->varFields[{fieldTag:e,content}]|
|patron grade|`^(PK\|K\|[1-9]\|10\|11\|12)$`|10|GRADE|f|PatronPatch->varFields[{fieldTag:f,content}]|
|patron status||11|STATUS|g|PatronPatch->varFields[{fieldTag:g,content}]|
|pcode2|`^[ct]$`|12|PCODE2|45|PatronPatch->patronCodes{pcode2:c}|
|patron type|`^(17\|18\|19\|21\|22)$`|13|PTYPE (PATCAT)|47|PatronPatch->patronType|
|patron hold code||14|HOLD CODE|c|PatronPatch->varFields[{fieldTag:c,content}]|
|patron library account expiration date||15|EXP DATE|43|PatronPatch->expirationDate|

## crosswalk pseudocode

### All patrons
```
fixedField["43"] = if (NOW month >= August) { NOW year + 1 . "0930" } else { NOW year . "0930" }
varField["c"] = substr(lastName,1,1) . substr(studentId,-4)
```

### St Paul Public School Students
```
varfield["="] = DO NOT FORGET PIN! (AND DO NOT PUT ALGORITHM IN GITHUB!)
varField["b"] = 22091600 . studentId
varField["u"] = studentId
if(varField["g"] >=6) { fixedField["47"] = 18 }
if(varField["g"] <=5) { fixedField["47"] = 17 }
```

### St Paul Public School Employees
```
varField["b"] = 22091625 . teacherid
varField["u"] = "t" . teacherId
```

### For all charter/private schools
```
if(varField["g"] >=6) { fixedField["47"] = 22 }
if(varField["g"] <=5) { fixedField["47"] = 21 }
```

### Charter School Avalon School 
```
varField["b"] = 22091800 . lpad(studentId,000000)
varField["u"] = "a" . lpad(studentId,000000)
```

### Charter School Twin Cities Academy
```
varField["b"] = 22091802 . lpad(studentId,000000)
varField["u"] = "tca" . lpad(studentId,000000)
```

### Charter School Cyber Village Academy
```
varField["b"] = 22091803 . lpad(studentId,000000)
varField["u"] = "v" . lpad(studentId,000000)
```

### Private School Friends School
```
varField["b"] = 22091810 . lpad(studentId,000000)
varField["u"] = "f" . lpad(studentId,000000)
```
