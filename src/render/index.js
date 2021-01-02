/*
 *  This file takes the constructed data from get() and
 *  returns the markdown content.
 *  Created On 09 November 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import qp from 'query-parse'

const trimChannelName = name => {
    if (name.length > 20) {
        return name.substring(0, 17).concat('...')
    } else {
        return name
    }
}

export default async (channels, spinner) => {
    spinner.text = 'Rendering Markdown file'
    let returnable = `<table align="center">`

    await utilities.loops.forEach(
        Object.keys(channels),
        async (name, index) => {
            const channel = channels[name]
            const position = (index + 1) % 4

            // loop through the links and construct the links HTML
            let linksHTML = `<p>`
            await utilities.loops.forEach(channel.links, (link, index) => {
                let directLink
                if (link.link.includes('youtube.com/redirect')) {
                    const parsed = qp.toObject(link.link.split('?')[1])
                    directLink = parsed.q
                } else {
                    directLink = link.link
                }

                linksHTML =
                    linksHTML +
                    `<a href="${directLink}" target="_blank" alt="${
                        link.alt
                    }" rel="noopener"><img loading="lazy" src="${
                        link.icon.startsWith('https')
                            ? link.icon
                            : 'https:' + link.icon
                    }"></a>${channel.links.length == index ? '' : ' '}`
            })
            linksHTML = linksHTML + '</p>'

            const channelHTML = `${
                position == 1 ? '<tr>' : ''
            }<td align="center"><p><img loading="lazy" src="${
                channel.logo
            }"><h4><a target="_blank" rel="noopener" href="${
                channel.link
            }">${trimChannelName(name)}</a></h4><p>${
                channel.subscribers
            }</p>${linksHTML}</p></td>${position == 0 ? '</tr>' : ''}`

            returnable = returnable + channelHTML
        },
    )

    return `${returnable}</table>`
}
