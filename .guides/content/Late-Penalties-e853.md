##

Use one script to set all of your course assignments late penalties. With careful assignment naming, you can even apply different late policies to different assignments from a single script.

## Script overview
The course assignments have end dates set (the very last day students can submit them) and are clearly marked with either homework, lab, or project at the beginning of the assignment name.

The course has 3 different late policies based on the type of assignment:
1. **Homework** can be up to 3 days late with a 10% penalty and up to 7 days late with a 30% penalty
    - [Highlight this section of code](open_file src/config.ts panel=0 ref="Homework:" count=17)
2. **Labs** can be up to 3 days late with a 5% penalty for every 12 hours the submission is late
    - [Highlight this section of code](open_file src/config.ts panel=0 ref="Labs:" count=16)
3. **Projects** can be up to 1 day late with a 1% penalty for every hour the submission is late
    - [Highlight this section of code](open_file src/config.ts panel=0 ref="Project:" count=16)

[Remove all highlighting](open_file src/config.ts panel=0)

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/config.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/config.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/config.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`

[Remove all highlighting](open_file src/config.ts panel=0)

Make any modifications as you see fit so that this script matches your use case. You can always refer to the original script here:
<details>
  <summary>
     <b>Copy of original script</b>
  </summary>

    require('dotenv').config()
    import codio from 'codio-api-js'
    import _ from 'lodash'
    import { Penalty } from 'codio-api-js/lib/lib/assignment'
    const api = codio.v1

    const clientId = process.env['CLIENT'] || 'clientId'
    const secret = process.env['SECRET'] || 'secret'

    // hardcoded values
    const courseId = 'courseId'

    function setDate(date: Date, shiftDays = 0, shiftHours = 0, shiftMinutes = 0): Date {
      const res = new Date(date);
      res.setDate(res.getDate() + shiftDays)
      res.setHours(res.getHours() + shiftHours)
      res.setMinutes(res.getMinutes() + shiftMinutes)
      return res
    }

    async function main() {
      await api.auth(clientId, secret)

      const course = await api.course.info(courseId)
      for (const assignment of course.assignments) {
        const settings = await api.assignment.getSettings(courseId, assignment.id)
        console.log(`Updateing ${assignment.name}`)
        if (!settings.endTime) {
          continue
        }
        const penalties: Penalty[] = []
        if (assignment.name.startsWith('Homework:')) { 
          // Homework can be up to 3 days late with a 10% penalty and up to 7 days late with a 30% penalty
          const dueDate = new Date(settings.endTime)
          dueDate.setDate(dueDate.getDate() - 10) // set Due Date 10 days before the end final date

          penalties.push({
            id: 1,
            percent: 10,
            datetime: setDate(dueDate, 3),
            message: '10%'
          })
          penalties.push({
            id: 2,
            percent: 30,
            datetime: setDate(dueDate, 7),
            message: '30%'
          })
        } else if (assignment.name.startsWith('Labs:')) {
          // Labs can be up to 3 days late with a 5% penalty for every 12 hours the submission is late
          
          const dueDate = new Date(settings.endTime)
          dueDate.setDate(dueDate.getDate() - 10) // set Due Date 10 days before the end final date

          let percent = 5
          for (let shift = 0; shift <= 3 * 24; shift += 12) {
            penalties.push({
              id: shift,
              percent,
              datetime: setDate(dueDate, 0, shift),
              message: `${percent}%`
            })
            percent += 5
          }
        } else if (assignment.name.startsWith('Project:')) {
          // Projects can be up to 1 day late with a 1% penalty for every hour the submission is late
          const dueDate = new Date(settings.endTime)
          dueDate.setDate(dueDate.getDate() - 1) // set Due Date 1 days before the end final date

          let percent = 1
          let i = 1
          for (let shift = 0; shift <= 24; shift++) {
            penalties.push({
              id: i,
              percent,
              datetime: setDate(dueDate, 0, shift),
              message: `${percent}%`
            })
            i++
            percent += 1
          }
        } else {
          continue
        }
        await api.assignment.updateSettings(courseId, assignment.id, {penalties})
      }
    }

    main().catch(_ => {
      console.error(_);
      process.exit(1)
    })

</details>

<br>
You can run the script on the left by pressing the button below:
{Run script | terminal}(yarn start src/config.ts)
