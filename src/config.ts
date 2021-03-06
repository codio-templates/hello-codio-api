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
    console.log(`Updating ${assignment.name}`)
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
