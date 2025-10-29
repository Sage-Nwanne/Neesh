<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ - NEESH Retailer</title>
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
        .faq-container {
            background: white;
            border-radius: 8px;
            padding: 30px;
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
            color: #333;
        }
        .faq-question:hover {
            color: #753bbd;
        }
        .faq-toggle {
            font-size: 20px;
            font-weight: 300;
        }
        .faq-answer {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            display: none;
            font-family: 'Manrope', sans-serif;
            line-height: 1.6;
        }
        .faq-answer.active {
            display: block;
        }
    </style>
</head>
<body>
    @if(auth()->check())
        @if(auth()->user()->hasRole('admin'))
            @include('layouts.admin_header')
        @elseif(auth()->user()->hasRole('publisher'))
            @include('layouts.publisherheader')
        @elseif(auth()->user()->hasRole('retailer'))
            @include('layouts.header')
        @endif
    @else
        @include('layouts.guest_header')
    @endif

    <div class="page-container">
        <div class="page-header">
            @if(auth()->check())
                <a href="{{ \App\Helpers\RouteHelper::getDashboardRoute() }}" class="back-link">
                    <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                    <span>Back to Dashboard</span>
                </a>
            @else
                <a href="{{ route('explore.index') }}" class="back-link">
                    <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                    <span>Back to Explore</span>
                </a>
            @endif
            <h1>Frequently Asked Questions</h1>
            <p>Find answers to common questions about NEESH</p>
        </div>

        <div class="faq-container">
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What is NEESH?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    NEESH is a digital platform that connects magazine publishers with retailers. Publishers can upload and manage their magazine inventory, while retailers can browse and order magazines for their stores.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How do I create an account?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    You can create an account by clicking the "Register" button and selecting whether you're a publisher or retailer. Fill in your information and follow the verification steps.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How do I browse magazines?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    As a retailer, you can browse all available magazines in the Catalogue section. Use the search and filter options to find specific titles or publishers.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How do I place an order?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    Browse the catalogue, select the magazines you want, add them to your cart, and proceed to checkout. You'll need to provide shipping and payment information to complete your order.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What payment methods do you accept?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment gateway. Your payment information is always encrypted and secure.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How long does shipping take?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    Standard shipping typically takes 5-7 business days. Express shipping options are available at checkout for faster delivery. You'll receive tracking information once your order ships.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>Can I cancel or modify my order?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    Orders can be cancelled or modified within 24 hours of placement. After that, please contact our support team for assistance.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What is your return policy?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    We offer a 30-day return policy for unopened magazines. To initiate a return, contact our support team with your order number and reason for return.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How do I contact support?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    You can contact our support team via email at support@neesh.com or through the Help Center. We typically respond within 24 hours.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>Is my personal information secure?</span>
                    <span class="faq-toggle">+</span>
                </div>
                <div class="faq-answer">
                    Yes, we take security very seriously. All data is encrypted and stored securely. We comply with industry standards for data protection and privacy.
                </div>
            </div>
        </div>
    </div>

    <script>
        // Toggle FAQ answers
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const toggle = this.querySelector('.faq-toggle');
                
                // Close other open FAQs
                document.querySelectorAll('.faq-answer.active').forEach(openAnswer => {
                    if (openAnswer !== answer) {
                        openAnswer.classList.remove('active');
                        openAnswer.previousElementSibling.querySelector('.faq-toggle').textContent = '+';
                    }
                });
                
                // Toggle current FAQ
                answer.classList.toggle('active');
                toggle.textContent = answer.classList.contains('active') ? '−' : '+';
            });
        });
    </script>
</body>
</html>

