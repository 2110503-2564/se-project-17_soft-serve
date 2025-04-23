export interface RestaurantItem {
    _id: string,
    name: string,
    description?: string,
    foodType?: string,
    address?: string,
    province: string,
    district?: string,
    postalcode?: string,
    tel?: string,
    openTime?: string,
    closeTime?: string,
    ratingrating?: number,
    reviewCount?: number,
    maxReservation: number,
    imgPath?: string,
    verified: boolean,
    __v?: number,
    id: string
}

export interface RestaurantJson {
    success: boolean,
    count: number,
    pagination: Pagination,
    data: RestaurantItem[]
}

export interface ReservationItem {
    _id: string,
    revDate: Date,
    user: string,
    restaurant: RestaurantItem,
    numberOfPeople: number,
    createdAt: Date,
    __v: number,
    id?: string
}

export interface ReservationJson {
    success: boolean,
    count?: number,
    pagination?: Pagination,
    data: ReservationItem[]
}

export interface OneReservationJson {
    success: boolean,
    data: ReservationItem
}

export interface Pagination {
    next?: {
        page: number;
        limit: number;
    },
    prev?: {
        page: number;
        limit: number;
    }
}

export interface User {
    _id: string,
    name: string,
    tel: string,
    email: string,
    role: string,
    verified: boolean,
    restaurant: string,
    createdAt : Date,
    __v : number
}

export interface UserJson {
    success: boolean,
    data : User
}

export interface NotificationItem{
    _id: string,
  title: string,
  message: string,
  creatorId: string,
  createdBy: string,
  restaurant?: RestaurantItem
  targetAudience: string,
  publishAt: Date,
  createdAt: Date,
  __v: number
}

export interface NotificationJson {
    success: boolean,
    count: number,
    data : NotificationItem[]
}

export interface ReviewItem {
  _id: string;
  rating: number;
  review: string;
  customerId: User;
  restaurantId: RestaurantItem;
  createdAt: string;
}

export interface ReviewJson {
    success: boolean,
    count: number,
    starCount : {
        oneStar : number,
        twoStar : number,
        threeStar : number,
        fourStar : number,
        fiveStar : number;
    }
    data : ReviewItem[]
}

export interface OneRestaurantJson {
    success: boolean,
    data: RestaurantItem
}

export interface RestaurantAvailabilityJson {
    restaurantId: string,
    date: string,
    maxReservation: number,
    reserved: number,
    available: number
}