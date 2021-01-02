/*
 *  This file takes the generated HTML and writes it to the README.md
 *  file while allowing it to have a template.
 *  Created On 09 November 2020
 */

import chalk from 'chalk'
import dirname from 'es-dirname'
import fs from 'fs/promises'
import path from 'path'

export default async (html, spinner, count) => {
    const template = await fs.readFile(
        path.join(dirname(), '..', 'README.template.md'),
        { encoding: 'utf-8' },
    )

    const rendered = template.replace('["render"]', html)
    await fs.writeFile(path.join(dirname(), '..', 'README.md'), rendered)
    spinner.succeed(
        `Successfully updated ${chalk.whiteBright.underline(
            'README.md',
        )} with ${chalk.bold.whiteBright.underline(count + ' channels')}.`,
    )
}
