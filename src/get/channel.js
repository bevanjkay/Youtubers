/*
 *  This file will attempt to get a channel's information. If not
 *  found, it will try to get a user's information.
 *  Created On 09 November 2020
 */

import utilities from '@vasanthdeveloper/utilities'
import axios from 'axios'

export default async channel => {
    // fetch the channel info from the YouTube
    // API
    const info = await utilities.promise.handle(
        axios({
            method: 'GET',
            url: `https://youtube.com/${channel}/about?flow=grid&view=0&pbj=1`,
            headers: {
                'x-youtube-client-name': '1',
                'x-youtube-client-version': '2.20180222',
                'accept-language': 'en-US,en;q=0.5',
            },
        }),
    )

    // handle the errors
    if (info.error) {
        console.log(
            `Failed to get info of ${channel} with status ${info.error.response.status}`,
        )

        return null
    }

    // construct a returnable channel object
    // and pre-fill the values we know will
    // exist for sure
    const returnable = {
        name:
            info.returned.data[1].response.metadata.channelMetadataRenderer
                .title,
        link:
            info.returned.data[1].response.metadata.channelMetadataRenderer
                .vanityChannelUrl,
        logo:
            info.returned.data[1].response.header.c4TabbedHeaderRenderer.avatar
                .thumbnails[1].url,
        links: [],
    }

    // some YouTube channels have their subscriptions hidden
    // so, we'll simply check if they have their subscriptions
    // and then add the subscribers
    if (
        info.returned.data[1].response.header.c4TabbedHeaderRenderer
            .subscriberCountText
    ) {
        returnable['subscribers'] =
            info.returned.data[1].response.header.c4TabbedHeaderRenderer.subscriberCountText.simpleText
    }

    // grab the channel's pinned links in the cover page
    try {
        // grab the primary link
        if (
            info.returned.data[1].response.header.c4TabbedHeaderRenderer
                .headerLinks.channelHeaderLinksRenderer.primaryLinks.length > 0
        ) {
            returnable.links.push({
                alt:
                    info.returned.data[1].response.header.c4TabbedHeaderRenderer
                        .headerLinks.channelHeaderLinksRenderer.primaryLinks[0]
                        .title.simpleText,
                link:
                    info.returned.data[1].response.header.c4TabbedHeaderRenderer
                        .headerLinks.channelHeaderLinksRenderer.primaryLinks[0]
                        .navigationEndpoint.urlEndpoint.url,
                icon: `https:${info.returned.data[1].response.header.c4TabbedHeaderRenderer.headerLinks.channelHeaderLinksRenderer.primaryLinks[0].icon.thumbnails[0].url}`,
            })
        }

        // loop through and get all the secondary ones too!
        await utilities.loops.forEach(
            info.returned.data[1].response.header.c4TabbedHeaderRenderer
                .headerLinks.channelHeaderLinksRenderer.secondaryLinks,
            async link => {
                returnable.links.push({
                    alt: link.title.simpleText,
                    link: link.navigationEndpoint.urlEndpoint.url,
                    icon: link.icon.thumbnails[0].url,
                })
            },
        )
    } catch {
        // simply bypass this fill up
        true
    }

    return returnable
}
