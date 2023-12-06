export const unReadNotificationsFunc = (notifications) => {
    return notifications.filter((u) => { return u.isRead === false })
}