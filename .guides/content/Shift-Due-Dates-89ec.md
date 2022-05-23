##

Quickly shift all due dates and late penalties by a set amount of time for all assignments within a range of dates.

## Script overview
A snow day occurs and all assignments due in the next week need to be extended 3 days.

The script:
* [gets all assignments in the course](open_file src/snow-day.ts panel=0 ref="const course " count=1)
* [identifies assignments due during the range of time and adjusts end date](open_file src/snow-day.ts panel=0 ref="adjustDate" count=9)
* [adjusts any late penalties](open_file src/snow-day.ts panel=0 ref="const penalties" count=7)

[Remove all highlighting](open_file src/snow-day.ts panel=0)

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/snow-day.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/snow-day.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/snow-day.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`
* [a start and end date for isolating affected assignments](open_file src/snow-day.ts panel=0 ref="snowDayStart" count=2)
* [the amount of days/hours/minutes to extend the assignment](open_file src/snow-day.ts panel=0 ref="shiftDays" count=3)

[Remove all highlighting](open_file src/snow-day.ts panel=0)

Make any modifications as you see fit so that this script matches your use case. You can always refer to the original script here:
<details>
  <summary>
     <b>Copy of original script</b>
  </summary>

    require('dotenv').config()
    import {v1 as api} from 'codio-api-js'
    import _ from 'lodash'

    const clientId = process.env['CLIENT'] || 'clientId'
    const secret = process.env['SECRET'] || 'secret'

    // hardcoded values
    let courseId = 'courseId'
    let snowDayStart = new Date('yyyy-mm-ddThh:mm:ss')
    let snowDayStop = new Date('yyyy-mm-ddThh:mm:ss')
    let shiftDays = 2
    let shiftHours = 12
    let shiftMinutes = 0

    function adjustDate(date: Date): boolean {
      if (date < snowDayStop && date > snowDayStart) {
        date.setDate(date.getDate() + shiftDays)
        date.setHours(date.getHours() + shiftHours)
        date.setMinutes(date.getMinutes() + shiftMinutes)
        return true
      }
      return false
    }

    async function main() {
      await api.auth(clientId, secret)

      const course = await api.course.info(courseId)
      for (const assignment of course.assignments) {
        const settings = await api.assignment.getSettings(courseId, assignment.id)
        if (!settings.endTime) {
          continue
        }
        let modified = adjustDate(settings.endTime)
        const penalties = settings.penalties || []
        for (const penalty of penalties) {
          if (!penalty.datetime) {
            continue
          }
          modified = adjustDate(penalty.datetime) || modified
        }
        if (modified) {
          console.log(`Updating ${assignment.id}`, settings)
          await api.assignment.updateSettings(courseId, assignment.id, settings)
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
{Run script | terminal}(yarn start src/snow-day.ts)
