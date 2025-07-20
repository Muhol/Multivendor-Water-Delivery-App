const BASE_URL =process.env.EXPO_PUBLIC_BACKEND_BASE_URL

const ApiRoutes = {
  CreateNewUser : {
    path: `${BASE_URL}/create_user`,
    method : "POST"
  },
  GetUserDetails : {
    path: `${BASE_URL}/get_user_details`,
    method : "GET"
  },
  UpdateProfilePic : {
    path: `${BASE_URL}/update_profile_pic`,
    method : "POST"
  },
  UpdateUserLocation : {
    path: `${BASE_URL}/update_user_location`,
    method : "POST"
  },
  AllVendors : {
    path: `${BASE_URL}/vendors`,
    method : "GET"
  },
  NearByVendors : {
    path: `${BASE_URL}/nearby_vendors`,
    method : "GET"
  },
  TopRatedVendors : {
    path: `${BASE_URL}/top_rated_vendors`,
    method : "GET"
  },
  VendorShopDetails : {
    path: `${BASE_URL}/vendor_details_and_products`,
    method : "POST"
  },
  VendorsByType : {
    path: `${BASE_URL}/vendor_by_type`,
    method : "POST"
  },
  TopBrandsVendors : {
    path: `${BASE_URL}/get_top_brands`,
    method : "GET"
  },
  ProductDetails : {
    path: `${BASE_URL}/get_product`,
    method : "POST"
  },
  ProductsWithOffer : {
    path: `${BASE_URL}/products_with_discount`,
    method : "GET"
  },
  RandomPaginatedProducts : {
    path: `${BASE_URL}/random_paginated_products`,
    method : "POST"
  },
  AddToCart : {
    path: `${BASE_URL}/add_to_cart`,
    method : "POST"
  },
  GetCart : {
    path: `${BASE_URL}/get_cart`,
    method : "GET"
  },
  GetDetailedCart : {
    path: `${BASE_URL}/get_detailed_cart`,
    method : "GET"
  },
  ChangeCartItemQuantity : {
    path: `${BASE_URL}/change_cart_item_quantity`,
    method : "POST"
  },
  DeleteCartItem : {
    path: `${BASE_URL}/delete_cart_item`,
    method : "POST"
  },
  Checkout : {
    path: `${BASE_URL}/mpesa_payment`,
    method : "POST"
  },
  ConfirmPayment : {
    path: `${BASE_URL}/confirm_payment`,
    method : "POST"
  },
  GetOrders : {
    path: `${BASE_URL}/get_orders`,
    method : "GET"
  },
}

export default ApiRoutes