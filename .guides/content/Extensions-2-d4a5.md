##

Use a script to easily add extensions for a student who will be out for an event (e.g. athletics) such that all assignments due in a range of dates will be due on a single, later date.

## Script overview
A student is out of state on a basketball tournament for a long weekend, so all assignments due during that weekend (Thurs-Sun) need to be due Wednesday.

The script:
* [finds the student using their email](open_file src/extension-to-date.ts panel=0 ref="students" count=6)
* [gets all assignments in the course](open_file src/extension-to-date.ts panel=0 ref="const course " count=1)
* [identifies those due during the range of time the student is away](open_file src/extension-to-date.ts panel=0 ref="endOfRange &&" count=1)
* [adjusts the deadlines](open_file src/extension-to-date.ts panel=0 ref="const extension" count=4)

[Remove all highlighting](open_file src/extension-to-date.ts panel=0)

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/extension-to-date.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/extension-to-date.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/extension-to-date.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`
* [the student's email address](open_file src/extension-to-date.ts panel=0 ref="studentEmail" count=1)
* [the range of dates the student won't be able to turn in assignments](open_file src/extension-to-date.ts panel=0 ref="startOfRange" count=2)
* [the new deadline for the assignments due in the specified range](open_file src/extension-to-date.ts panel=0 ref="newDeadLine" count=1)


[Remove all highlighting](open_file src/extension-to-date.ts panel=0)

|||important
### Codio ignores test students and teachers
If you are testing this API script, you will need to create a "real" test student as Codio ignores both test students, and students who are also course instructors -- meaning you will get a `student not found` error!

|||

Make any modifications as you see fit so that this script matches your use case. You can always refer to the original script here:
<details>
  <summary>
     <b>Copy of original script</b>
  </summary>
    require('dotenv').config()
    import codio from 'codio-api-js'
    import _ from 'lodash'
    const api = codio.v1

    const clientId = process.env['CLIENT'] || 'clientId'
    const secret = process.env['SECRET'] || 'secret'

    // hardcoded values
    const courseId = 'courseId'
    const studentEmail = 'student@email.com'
    let startOfRange = new Date('yyyy-mm-ddThh:mm:ss')
    let endOfRange = new Date('yyyy-mm-ddThh:mm:ss')
    let newDeadLine = new Date('yyyy-mm-ddThh:mm:ss')

    async function main() {
      await api.auth(clientId, secret)
      const students = await api.course.getStudents(courseId)

      const student = _.find(students, {email: studentEmail})
      if (_.isUndefined(student)) {
          throw new Error(`${studentEmail} student not found`)
      }
      const course = await api.course.info(courseId)

      for (const assignment of course.assignments) {
        const settings = await api.assignment.getSettings(courseId, assignment.id)
        if (!settings.endTime) {
          continue
        }
        if (settings.endTime < endOfRange && settings.endTime > startOfRange) {
          const extension = (newDeadLine.getTime() - settings.endTime.getTime()) / (1000 * 60)
          console.log(`Adjusting ${assignment.name} adding ${extension} minutes`)
          await api.assignment.updateStudentTimeExtension(courseId, assignment.id, student.id, {
            extendedDeadline: extension
          })
        }
      }
    }

    main().catch(_ => {
      console.error(_);
      process.exit(1)
    }) 

</details>

<br>
You can run the script on the left by pressing the button below:
{Run script | terminal}(yarn start src/extension-to-date.ts)
