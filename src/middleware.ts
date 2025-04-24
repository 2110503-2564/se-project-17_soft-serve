export { default } from 'next-auth/middleware'

export const config = {
    matcher: [
        "/admin",
        "/admin/notifications",
        "/admin/notifications/create",
        "/admin/reservations",
        "/admin/restaurants",
        "/admin/verify",
        "/admin/reviews",
        "/manager/reviews",
        "/reservations", 
        "/reservations/[rid]",
        "/reservations/edit/[reserveId]",
        "/restaurants/edit/[restaurantId]",
        "/rating/[rid]",
        "/user", 
        "/user/profile", 
        "/user/changepassword",
        "/notifications"
    ]
};
