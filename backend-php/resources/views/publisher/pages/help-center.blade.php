<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Help Center - NEESH Publisher</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/css/style.css') }}">
    <script src="{{ asset('assets/js/menu.js') }}"></script>
    <style>
        .page-container {
            max-width: 1000px;
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
        .search-box {
            margin-bottom: 40px;
        }
        .search-box input {
            width: 100%;
            padding: 16px;
            border: 2px solid #eee;
            border-radius: 8px;
            font-size: 16px;
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
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
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
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 20px;
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
        }
        .faq-answer {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
            font-family: 'Manrope', sans-serif;
            display: none;
        }
        .faq-answer.active {
            display: block;
        }
        .contact-section {
            background: black;
            color: white;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
        }
        .contact-section h2 {
            font-size: 24px;
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
            color: #ffffffff;
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
    @include('layouts.publisherheader')

    <div class="page-container">
        <div class="page-header">
            <a href="{{ route('publisher.dashboard') }}" style="text-decoration: none; color: #666; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 20px; justify-content: center;">
                <img src="{{ asset('assets/image/left arrow.png') }}" alt="Back" style="width: 20px;">
                <span>Back to Dashboard</span>
            </a>
            <h1>Help Center</h1>
            <p>Find answers and get support for your publisher account</p>
        </div>

        <div class="search-box">
            <input type="text" placeholder="Search for help articles...">
        </div>

        <div class="help-categories">
            <div class="help-category">
                <div class="help-category-icon">📚</div>
                <h3>Getting Started</h3>
                <p>Learn the basics of publishing on NEESH</p>
            </div>
            <div class="help-category">
                <div class="help-category-icon">📤</div>
                <h3>Uploading Magazines</h3>
                <p>Step-by-step guide to upload your titles</p>
            </div>
            <div class="help-category">
                <div class="help-category-icon">💰</div>
                <h3>Pricing & Payments</h3>
                <p>Understand pricing and payment options</p>
            </div>
            <div class="help-category">
                <div class="help-category-icon">📊</div>
                <h3>Analytics</h3>
                <p>Track your sales and performance</p>
            </div>
        </div>

        <div class="faq-section">
            <h2 style="font-size: 24px; margin-bottom: 30px; font-family: 'Manrope', sans-serif;">Frequently Asked Questions</h2>
            
            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How do I upload my first magazine?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    Go to your Dashboard and click "Upload Magazine". Fill in all the required information about your publication, upload cover images, and set your pricing. Once submitted, your magazine will be reviewed and published.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What image formats are supported?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    We support JPEG, PNG, GIF, and WebP formats. Images should be at least 500x650 pixels for best quality. Maximum file size is 5MB per image.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>How are payments processed?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    Payments are processed monthly. You'll receive payment for all orders from the previous month. We support bank transfers and other payment methods. Check your account settings for payment details.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>Can I edit my magazine after publishing?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    Yes! You can edit your magazine details, pricing, and images anytime from your Catalogue. Changes will be reflected immediately on the platform.
                </div>
            </div>

            <div class="faq-item">
                <div class="faq-question" onclick="this.nextElementSibling.classList.toggle('active')">
                    <span>What is the commission rate?</span>
                    <span>+</span>
                </div>
                <div class="faq-answer">
                    NEESH takes a 15% commission on each sale. You receive 85% of the wholesale price. This helps us maintain the platform and support your success.
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
        document.addEventListener('DOMContentLoaded', function() {
            const faqQuestions = document.querySelectorAll('.faq-question');
            faqQuestions.forEach(question => {
                question.addEventListener('click', function() {
                    const answer = this.nextElementSibling;
                    answer.classList.toggle('active');
                    this.querySelector('span:last-child').textContent = answer.classList.contains('active') ? '−' : '+';
                });
            });
        });
    </script>
</body>
</html>

