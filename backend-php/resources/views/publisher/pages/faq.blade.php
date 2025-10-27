<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAQ - NEESH Publisher</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <style>
        .page-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        .page-header {
            margin-bottom: 40px;
            text-align: center;
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
            overflow: hidden;
        }
        .faq-section {
            border-bottom: 2px solid #eee;
        }
        .faq-section:last-child {
            border-bottom: none;
        }
        .faq-section-title {
            background: #f5f5f5;
            padding: 20px;
            font-size: 18px;
            font-weight: 600;
            color: #333;
            font-family: 'Manrope', sans-serif;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .faq-section-title:hover {
            background: #efefef;
        }
        .faq-items {
            display: none;
            padding: 20px;
        }
        .faq-items.active {
            display: block;
        }
        .faq-item {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
        }
        .faq-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .faq-question {
            font-size: 16px;
            font-weight: 600;
            color: #333;
            cursor: pointer;
            font-family: 'Manrope', sans-serif;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
        }
        .faq-question:hover {
            color: #753bbd;
        }
        .faq-answer {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            font-family: 'Manrope', sans-serif;
            display: none;
            line-height: 1.6;
        }
        .faq-answer.active {
            display: block;
        }
        .back-link {
            text-decoration: none;
            color: #666;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 20px;
        }
        .back-link:hover {
            color: #333;
        }
    </style>
</head>
<body>
    @include('layouts.publisherheader')

    <div class="page-container">
        <a href="{{ route('publisher.dashboard') }}" class="back-link">
            <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
            <span>Back to Dashboard</span>
        </a>

        <div class="page-header">
            <h1>Frequently Asked Questions</h1>
            <p>Find quick answers to common questions</p>
        </div>

        <div class="faq-container">
            <!-- Getting Started Section -->
            <div class="faq-section">
                <div class="faq-section-title" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                    <span>Getting Started</span>
                    <span>+</span>
                </div>
                <div class="faq-items">
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>How do I create a publisher account?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            Visit our homepage and click "Become a Publisher". Fill out the application form with your business details, and our team will review your application within 2-3 business days.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>What documents do I need to provide?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            You'll need to provide your business registration, tax ID, and banking information. We also recommend providing samples of your publications or press coverage.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Publishing Section -->
            <div class="faq-section">
                <div class="faq-section-title" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                    <span>Publishing Your Magazines</span>
                    <span>+</span>
                </div>
                <div class="faq-items">
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>What are the image requirements?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            Images should be in JPEG, PNG, GIF, or WebP format. Minimum size is 500x650 pixels, and maximum file size is 5MB. High-quality images help attract retailers.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>Can I upload multiple images per magazine?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            Yes! You can upload up to 6 images per magazine. This helps retailers see different angles and details of your publication.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>How long does it take for my magazine to be published?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            Most magazines are published within 24 hours of submission. Our team reviews each submission to ensure quality standards are met.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pricing & Payments Section -->
            <div class="faq-section">
                <div class="faq-section-title" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                    <span>Pricing & Payments</span>
                    <span>+</span>
                </div>
                <div class="faq-items">
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>How do I set prices for my magazines?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            You set both wholesale and retail prices when uploading your magazine. The wholesale price is what retailers pay, and the retail price is the suggested retail price.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>What is the commission structure?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            NEESH takes a 15% commission on each sale. You receive 85% of the wholesale price. This helps us maintain the platform and support your success.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>When do I receive payments?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            Payments are processed monthly. You'll receive payment for all orders from the previous month by the 15th of the current month.
                        </div>
                    </div>
                </div>
            </div>

            <!-- Support Section -->
            <div class="faq-section">
                <div class="faq-section-title" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                    <span>Support & Troubleshooting</span>
                    <span>+</span>
                </div>
                <div class="faq-items">
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>How do I contact support?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            You can reach our support team at support@neesh.com or through the Help Center in your dashboard. We typically respond within 24 hours.
                        </div>
                    </div>
                    <div class="faq-item">
                        <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active'); this.querySelector('span:last-child').textContent = this.nextElementSibling.classList.contains('active') ? '−' : '+'">
                            <span>What if I have a technical issue?</span>
                            <span>+</span>
                        </div>
                        <div class="faq-answer">
                            Please describe the issue in detail and include screenshots if possible. Email support@neesh.com with your account information, and our technical team will assist you.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

