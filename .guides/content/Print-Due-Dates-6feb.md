##

Print out the due dates for the course assignments for easy inclusion in a syllabus, on a course website or just to check your course is configured correctly.

## Script overview
You have everything setup in Codio -- hooray! The script on the left prints out a list of all the assignments in the course, similar to how they are presented in the course, with their corresponding due date.

Since Codio does not have a due date field, the script checks if there are late penalties, and prints either the assignment end date if there are no late penalties, or the first late penalty (which is the latest a student can turn the assignment in without points off).

## Using the script
To use this script, you need to fill out the following hardcoded values. Click to highlight the variable in the code file:
* [clientID](open_file src/info.ts panel=0 ref="clientId" count=1) (only if you did NOT set as an environment variable)
* [secret](open_file src/info.ts panel=0 ref="secret" count=1)  (only if you did NOT set as an environment variable)
* [courseId](open_file src/info.ts panel=0 ref="courseId" count=1)
    * Navigate to the course you want to use in a different tab and copy the course ID from the URL bar: `https://codio.com/home/teacher/course_id_string_here/overview`

* If the script is printing in a different format then you were expecting, you can hardcode [the time and date format](open_file src/info.ts panel=0 ref="datetime.toLocaleString" count=1)
    * UK: `toLocaleString('en-GB')` - day-month-year order and 24-hour time without AM/PM
    * US: `toLocaleString('en-US')` - month-day-year order and 12-hour time with AM/PM
    * Or [configure how date and time are printed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString#using_options)

[Remove all highlighting](open_file src/info.ts panel=0)

|||important
### Codio uses UTC by default
If you are running this in Codio, the due dates will print in UTC by default.

In the terminal (bottom-left), print out the list of timezones to choose from:
```
timedatectl list-timezones
```

Some common ones are:
 * America/New_York
 * America/Chicago
 * America/Denver
 * America/Los_Angeles

In the terminal (bottom-left), set your chosen timezone:
```
sudo timedatectl set-timezone America/New_York
```

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

    async function main() {
      await api.auth(clientId, secret)

      const course = await api.course.info(courseId)
      for (const module of course.modules) {
        console.log(`${module.name} :`)
        for (const assignment of module.assignments) {
          const settings = await api.assignment.getSettings(courseId, assignment.id)
          let due = settings.endTime ? settings.endTime.toLocaleString() : 'No'
          if (settings.penalties && settings.penalties?.length > 0) {
            due = _.sortBy(settings.penalties, ['datetime'])[0].datetime.toLocaleString()
          }
          console.log(`  ${assignment.name} - Due ${due}`)
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
{Run script | terminal}(yarn start src/info.ts)
