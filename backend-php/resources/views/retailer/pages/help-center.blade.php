<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help Center - NEESH Retailer</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <style>
        .page-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .page-header {
            margin-bottom: 40px;
        }
        .page-header h1 {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .page-header p {
            font-size: 16px;
            color: #666;
            font-family: 'Manrope', sans-serif;
        }
        .help-categories {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        .help-category {
            background: white;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .help-category:hover {
            border-color: #753bbd;
            box-shadow: 0 4px 12px rgba(117, 59, 189, 0.1);
        }
        .help-category-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }
        .help-category h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .help-category p {
            font-size: 14px;
            color: #666;
            font-family: 'Manrope', sans-serif;
        }
        .faq-section {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
        }
        .faq-section h2 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
            font-family: 'Manrope', sans-serif;
        }
        .faq-item {
            border-bottom: 1px solid #eee;
            padding: 20px 0;
        }
        .faq-item:last-child {
            border-bottom: none;
        }
        .faq-question {
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Manrope', sans-serif;
        }
        .faq-question:hover {
            color: #753bbd;
        }
        .faq-answer {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            display: none;
            font-family: 'Manrope', sans-serif;
        }
        .faq-answer.active {
            display: block;
        }
        .contact-section {
            background: linear-gradient(135deg, #753bbd 0%, #5a2d8a 100%);
            color: white;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
        }
        .contact-section h2 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            font-family: 'Manrope', sans-serif;
        }
        .contact-section p {
            font-size: 16px;
            margin-bottom: 20px;
            font-family: 'Manrope', sans-serif;
        }
        .btn-white {
            display: inline-block;
            background: white;
            color: #000000;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            font-family: 'Manrope', sans-serif;
        }
        .btn-white:hover {
            background: #f0f0f0;
        }
    </style>
</head>
<body>
    @include('layouts.header')

    <div class="page-container">
        <div class="page-header">
            @if(auth()->check())
                <a href="{{ \App\Helpers\RouteHelper::getDashboardRoute() }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; justify-content: center;">
                    <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                    <span>Back to Dashboard</span>
                </a>
            @else
                <a href="{{ route('explore.index') }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; justify-content: center;">
                    <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                    <span>Back to Explore</span>
                </a>
            @endif
            <h1>Help Center</h1>
            <p>Find answers to common questions about ordering and managing your account</p>
        </div>

        <div class="help-categories">
            <div class="help-category">
                <div class="help-category-icon">📚</div>
                <h3>Getting Started</h3>
                <p>Learn the basics of browsing and ordering magazines</p>
            </div>
            <div class="help-category">
                <div class="help-category-icon">🛒</div>
                <h3>Ordering</h3>
                <p>How to place and manage your magazine orders</p>
            </div>
            <div class="help-category">
                <div class="help-category-icon">💳</div>
                <h3>Payment</h3>
                <p>Payment methods and billing information</p>
            </div>
            <div class="help-category">
                <div class="help-category-icon">📦</div>
                <h3>Shipping</h3>
                <p>Shipping options and delivery information</p>
            </div>
        </div>

        <div class="faq-section">
            <h2>Frequently Asked Questions</h2>
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How do I place an order?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    Browse our catalogue, select the magazines you want, add them to your cart, and proceed to checkout. You can pay using our secure payment system.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What payment methods do you accept?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    We accept all major credit cards (Visa, Mastercard, American Express) and other payment methods through our secure Stripe payment gateway.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How long does shipping take?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>Can I cancel or modify my order?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    Orders can be cancelled or modified within 24 hours of placement. Contact our support team for assistance with your order.
                </div>
            </div>
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What is your return policy?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    We offer a 30-day return policy for unopened magazines. Please contact our support team to initiate a return.
                </div>
            </div>
        </div>

        <div class="contact-section">
            <h2>Still need help?</h2>
            <p>Our support team is here to assist you</p>
            <a href="mailto:support@neesh.com" class="btn-white">Contact Support</a>
        </div>
    </div>

    <script>
        // Allow clicking on help categories to expand FAQs
        document.querySelectorAll('.help-category').forEach(category => {
            category.addEventListener('click', function() {
                document.querySelector('.faq-section').scrollIntoView({ behavior: 'smooth' });
            });
        });
    </script>
</body>
</html>

