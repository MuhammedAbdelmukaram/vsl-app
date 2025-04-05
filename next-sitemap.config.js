/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: "https://vslplayer.io", // replace with your actual domain
    generateRobotsTxt: true,
    exclude: [
        "/login",
        "/signup",
        "/ab-testing",
        "/analytics",
        "/cancel",
        "/embed/*",
        "/faq",
        "/home",
        "/plan",
        "/plans",
        "/profile",
        "/upload",
        "/video/*",
        "/videos"
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: "*",
                allow: ["/", "/pricing", "/guide"],
                disallow: [
                    "/login",
                    "/signup",
                    "/ab-testing",
                    "/analytics",
                    "/cancel",
                    "/embed/",
                    "/faq",
                    "/home",
                    "/plan",
                    "/plans",
                    "/profile",
                    "/upload",
                    "/video/",
                    "/videos"
                ],
            },
        ],
        additionalSitemaps: [
            "https://vslplayer.io/sitemap.xml",
        ],
    },
}
