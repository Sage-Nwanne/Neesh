<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PublisherPageController extends Controller
{
    /**
     * Show the catalogue page
     */
    public function catalogue()
    {
        return view('publisher.pages.catalogue');
    }

    /**
     * Show the orders page
     */
    public function orders()
    {
        return view('publisher.pages.orders');
    }

    /**
     * Show the messages page
     */
    public function messages()
    {
        return view('publisher.pages.messages');
    }

    /**
     * Show the account page
     */
    public function account()
    {
        $user = Auth::user();
        return view('publisher.pages.account', compact('user'));
    }

    /**
     * Show the help center page
     */
    public function helpCenter()
    {
        return view('publisher.pages.help-center');
    }

    /**
     * Show the FAQ page
     */
    public function faq()
    {
        return view('publisher.pages.faq');
    }
}

