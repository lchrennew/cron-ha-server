const apiDef = {
    name: process.env.SERVER_NAME,
    uri: '/',
    links: {
        adminApi:{
            href: '/admin-api',
            description: 'For User Interface',
        },
        clientApi: {
            href: '/client-api',
            description: 'For Systems',
        },
    },
};
export default apiDef;
