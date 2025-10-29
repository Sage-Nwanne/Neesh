<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class RetailerPageController extends Controller
{
    /**
     * Show the catalogue page for retailers
     */
    public function catalogue()
    {
        return view('retailer.pages.catalogue');
    }

    /**
     * Show the orders page for retailers
     */
    public function orders()
    {
        $user = Auth::user();
        $retailerProfile = $user->retailerProfile;
        
        // Get retailer's orders (orders they've placed)
        $orders = $retailerProfile ? $retailerProfile->orders()->paginate(15) : collect();
        
        return view('retailer.pages.orders', compact('orders', 'retailerProfile'));
    }

    /**
     * Show the messages page for retailers
     */
    public function messages()
    {
        return view('retailer.pages.messages');
    }

    /**
     * Show the account page for retailers
     */
    public function account()
    {
        $user = Auth::user();
        return view('retailer.pages.account', compact('user'));
    }

    /**
     * Show the help center page for retailers
     */
    public function helpCenter()
    {
        return view('retailer.pages.help-center');
    }

    /**
     * Show the FAQ page for retailers
     */
    public function faq()
    {
        return view('retailer.pages.faq');
    }

    /**
     * Show the payment and shipping page for retailers
     */
    public function paymentShipping()
    {
        $user = Auth::user();
        $retailerProfile = $user->retailerProfile;
        
        return view('retailer.pages.payment-shipping', compact('retailerProfile'));
    }
}

