/*
 *  This file will build and update the README.md on this
 *  repository.
 *  Created On 08 November 2020
 */

import ora from 'ora'

import get from './get/index.js'
import render from './render/index.js'
import write from './write.js'

// create an ora spinner
// and pass it to our
// functions below
const spinner = ora({
    color: 'yellow',
    hideCursor: true,
    text: 'Preparing',
})
spinner.start()

// fetch channel information and
// construct an object ready
// for README.md generation
const got = await get(spinner)

// convert this object into an
// HTML table that is supported
// by GitHub
const html = await render(got.channels, spinner)

// finally, write the generated HTML
// on the README.md file
await write(html, spinner, got.count)
