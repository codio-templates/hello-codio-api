##

Use a script to easily add extensions for a student who is out sick for specific assignments and/or modules

## Script overview
A student let's you know they are sick and needs all the assignment due dates in this week's module, as well as the first two assignments in next week's module, to be extended by a set number of days.

The sliding extensions script on the left takes:
  1. the student's email address
  2. a set of assignment name(s) and/or module name(s)
  3. the number of days/hours/minutes the assignments should be extended.

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/sliding-extension.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/sliding-extension.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/sliding-extension.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`

[Remove all highlighting](open_file src/sliding-extension.ts panel=0)

Make any modifications as you see fit so that this script matches your use case. ==You can always refer to the original script here:==
<details>
  <summary>
     <b>Copy of original script - FILL OUT</b>
  </summary>

      

</details>

<br>
You can run the script on the left by pressing the button below:
{Run script | terminal}(yarn start src/sliding-extension.ts)
