CRUD

Student ID os composed of a prefix, a school code, and a student-specific id.
Duplicate accounts are OK. When a student moves from schall A to school B, the Library expects to have multiple patron accounts representing that student
There is no staff data extract.

CREATE PATRON 
When compared against ILS extract, new APATID/SSN appears -> new patron should be created.

UPDATE PATRON
Changes when ILS extract differs from school extract in any of the following fields
Name
Address
Grade
Enrolled/Not Enrolled

DELETE PATRON



Sierra load profile information

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
