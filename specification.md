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

##Crosswalk

|Infinite Campus Extract|Sierra API|Sierra Patron Record|
|-|-|-|
||PatronPatch->barcodes[]|P BARCODE(b)|
||PatronPatch->uniqueIds[]|STUDENTID APATID/SSN(u)|
||PatronPatch->names[]|PATRN NAME(n)|
||PatronPatch->addresses[{lines[],type:a}]|ADDRESS(a)|
||PatronPatch->phones[{number,type:t}]|TELEPHONE(t)|
||PatronPatch->varFields[{fieldTag:e,content}]|SCHOOL(e)|
||PatronPatch->varFields[{fieldTag:f,content}]|GRADE(f)|
||PatronPatch->varFields[{fieldTag:g,content}]|STATUS(g)|
||PatronPatch->emails[]|EMAIL ADDR(z)|
||PatronPatch->pin|PIN(=)|
||PatronPatch->varFields[{fieldTag:c,content}]|HOLD CODE(c)|
||PatronPatch->birthDate|\<BIRTH DATE>|
||PatronPatch->varFields[{fieldTag:d,content}]|DOB(d)|
||PatronPatch->patronCodes{pcode2:c}|\<PCODE2>|
||PatronPatch->expirationDate|\<EXP DATE>|
||PatronPatch->patronType |PTYPE \<PATCAT>?|
