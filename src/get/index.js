/*
 *  This file will fetch the channels information from it's username
 *  and construct a new object containing all the data required for
 *  building the README.md file.
 *  Created On 08 November 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import chalk from 'chalk'
import dirname from 'es-dirname'
import fs from 'fs/promises'
import path from 'path'

import getChannelInfo from './channel.js'

// getChannelList() reads the channels.txt file
// and returns it's contents as an array
const getChannelList = async () =>
    (
        await fs.readFile(path.join(dirname(), '..', '..', 'channels.txt'), {
            encoding: 'utf-8',
        })
    ).split('\n')

export default async spinner => {
    const channelList = await getChannelList()

    const returnable = {}

    await utilities.loops.forEach(channelList, async (channel, index) => {
        const channelInfo = await getChannelInfo(channel)
        returnable[channelInfo.name] = channelInfo
        spinner.text = `Fetched ${chalk.gray(
            `(${index}/${channelList.length})`,
        )} ${chalk.bold.whiteBright.underline(channelInfo.name)}`
        delete returnable[channelInfo.name].name
    })

    // alphabetically sort these channels
    // for a uniform experience
    return {
        count: channelList.length,
        channels: Object.keys(returnable)
            .sort()
            .reduce(
                (acc, key) => ({
                    ...acc,
                    [key]: returnable[key],
                }),
                {},
            ),
    }
}
