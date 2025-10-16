@extends('layouts.app')

@section('title', 'Neesh Publisher Terms of Service')

@section('content')
<div class="terms-page-wrapper">
    <div class="terms-card">
        <div class="terms-header">
            <img src="{{ asset('assets/image/Logo A1.png') }}" alt="Neesh Logo" class="neesh-logo">
            <h1 class="terms-heading">📜 Neesh Publisher Terms of Service</h1>
            <p class="terms-updated">Last Updated: October 2025</p>
        </div>

        <div class="terms-scroll">
            @php
$termsText = <<<TEXT
These Publisher Terms of Service ("Terms") constitute a binding legal agreement between you ("Publisher," "you," or "your") and Neesh Inc. ("Neesh," "we," "us," or "our"). By creating an account, uploading content, or using the Neesh platform, you agree to be bound by these Terms.
1. DEFINITIONS
1.1 "Platform" means Neesh's SaaS-enabled marketplace, including all software, tools, dashboards, and services provided by Neesh.
1.2 "Content" means all magazine titles, metadata, images, descriptions, and related materials you submit to the Platform.
1.3 "Retailer" means any approved third-party buyer who purchases Publisher inventory through the Platform.
1.4 "Wholesale Price" means the price set by Publisher at which Retailers may purchase inventory, excluding Platform Fees.
1.5 "Gross Transaction Value" or "GTV" means the total Wholesale Price paid by Retailers for Publisher inventory.
2. ACCEPTANCE AND MODIFICATIONS
2.1 Acceptance. By accessing or using the Platform, you represent and warrant that: (a) you have the legal authority to enter into these Terms; (b) you are at least 18 years old; and (c) all information you provide is accurate and complete.
2.2 Modifications. Neesh reserves the right to modify these Terms at any time. We will provide notice of material changes via email or Platform notification at least 30 days prior to the effective date. Your continued use of the Platform after such notice constitutes acceptance of the modified Terms. If you do not agree to the modifications, you must discontinue use of the Platform.
2.3 Additional Policies. These Terms incorporate by reference our Privacy Policy, Acceptable Use Policy, and any other guidelines posted on the Platform.
3. PUBLISHER ELIGIBILITY AND APPROVAL
3.1 Eligibility Requirements. To participate on the Platform, you must:
(a) Publish a physical magazine with an active print run of between 500 and 10,000 copies per issue;
(b) Operate as an established publication, not utilizing print-on-demand services;
(c) Provide accurate and complete metadata including but not limited to: retail price, format specifications, issue number, circulation volume, and high-resolution imagery;
(d) Agree to participate exclusively on a wholesale-only basis (no consignment arrangements).
3.2 Approval Process. All Publishers are subject to Neesh's hybrid curation workflow, which includes:
(a) Application submission and data verification;
(b) Automated scoring based on print quality, retail readiness, and cultural relevance;
(c) Manual review by Neesh's editorial and retail team.
3.3 Approval Discretion. Neesh reserves sole discretion to approve or reject any Publisher application. Approval may be revoked at any time if the Publisher fails to maintain eligibility requirements or violates these Terms.
4. PLATFORM FEES AND PRICING
4.1 Platform Fee. Neesh charges Publishers a platform fee equal to 4% of GTV for each completed transaction. This fee is automatically deducted from your payout.
4.2 Retailer Transaction Fee. Retailers are charged a separate 6% service fee, which does not reduce Publisher payouts.
4.3 Right to Modify Fees. Neesh reserves the right to modify the Platform Fee structure at any time. We will provide at least 30 days' advance written notice of any fee increases via email to your registered account. Fee decreases may be implemented immediately without notice. Your continued use of the Platform after the effective date of any fee change constitutes acceptance of the new fee structure. If you do not agree to a fee increase, you may terminate your account in accordance with Section 13.
4.4 Processing Fees. All payment processing fees charged by third-party payment processors (e.g., Stripe) are borne by Neesh and are not passed through to Publishers or Retailers.
4.5 Taxes. You are responsible for determining and remitting any applicable taxes associated with your use of the Platform and sale of inventory, including but not limited to sales tax, VAT, GST, and income tax. Neesh does not collect or remit taxes on your behalf unless required by law.
5. PAYMENTS AND PAYOUTS
5.1 Payment Schedule. Payouts are processed automatically via Stripe on a monthly schedule, subject to the following conditions:
(a) Orders must be marked as fulfilled;
(b) The applicable return period must have elapsed without a return being initiated;
(c) Your account must be in good standing.
5.2 Payment Method. All payouts are issued via Stripe. You must maintain a valid Stripe account in good standing. Neesh is not responsible for delays or failures caused by Stripe or your banking institution.
5.3 Currency. All transactions are currently processed in USD. Multi-currency support (GBP, EUR) may be added at Neesh's discretion.
5.4 Withholding. Neesh reserves the right to withhold payouts if: (a) we suspect fraudulent activity; (b) there are unresolved disputes or chargebacks; (c) you have violated these Terms; or (d) we are required to do so by law.
5.5 Minimum Payout. Payouts below $25 may be accumulated and paid in the subsequent cycle.
6. PRICING AND WHOLESALE STRUCTURE
6.1 Pricing Authority. You retain sole authority to set Wholesale Prices for your inventory. Neesh may provide non-binding pricing guidance based on comparable titles and market data.
6.2 Pricing Transparency. All prices displayed to Retailers include:
(a) Wholesale Price;
(b) Estimated shipping costs (landed cost);
(c) Retailer Transaction Fee (if applicable).
6.3 Order Controls. You may configure:
(a) Minimum order quantities per Retailer;
(b) Retailer eligibility criteria (including the right to approve or deny specific Retailers);
(c) Available inventory by issue or SKU.
6.4 Price Integrity. You represent and warrant that all pricing information is accurate and complies with applicable laws, including but not limited to price discrimination and antitrust regulations.
7. RETURNS POLICY
7.1 Return Window. Retailers may return unsold inventory within 30 days of delivery.
7.2 Return Coordination. Neesh coordinates all returns using prepaid shipping labels provided through our logistics partners. You will be notified of all return requests via the Platform.
7.3 Return Handling Options. You must select one of the following return handling methods for each title:
(a) Resale via Circular Network: Returned inventory re-enters the Neesh marketplace and may be resold to other Retailers, with proceeds remitted to you;
(b) Restock: Returned inventory is shipped back to your designated address at your expense;
(c) Buyback Credit: Neesh issues a credit equal to the Wholesale Price, deducted from future payouts.
7.4 Return Processing Fee. A handling fee of $0.15 per unit is charged to cover logistics coordination and inspection. This fee is deducted from your payout or credited account balance.
7.5 Return Condition. Returned inventory must be in saleable condition. Neesh reserves the right to reject returns that are damaged, defaced, or otherwise unsellable due to Retailer mishandling.
8. FULFILLMENT AND SHIPPING
8.1 Fulfillment Responsibility. You may fulfill orders through:
(a) Direct shipment to Retailers; or
(b) Neesh-approved third-party logistics providers (3PLs) including ShipBob, ShipMonk, or other designated partners.
8.2 Publisher Obligations. If fulfilling directly, you are responsible for:
(a) Packaging inventory in accordance with industry standards to prevent damage;
(b) Providing tracking information and delivery confirmation;
(c) Meeting shipment deadlines specified in the order;
(d) Coordinating with Neesh regarding prepaid return labels.
8.3 Shipping Costs. Shipping costs are borne by the Retailer and calculated at checkout based on carrier rates and destination.
8.4 Late or Failed Delivery. You are liable for orders that are not fulfilled within the specified timeframe or that are lost or damaged due to improper packaging. Neesh may issue refunds to Retailers and deduct such amounts from your payouts.
9. DATA, ANALYTICS, AND REPORTING
9.1 Data Access. Neesh provides you with access to operational analytics, including but not limited to:
(a) Sell-through reports by Retailer and geographic region;
(b) Return summaries and return reasons;
(c) Retailer reorder frequency and patterns;
(d) Point-of-sale performance data (where available).
9.2 Data Ownership. Aggregate and anonymized platform data remains the property of Neesh. You retain ownership of your proprietary Content and sales data specific to your titles.
9.3 Data Usage. Neesh may use aggregated, anonymized data for platform improvements, benchmarking, and marketing purposes. We will not share identifiable Publisher data with third parties without your consent, except as required by law.
10. MARKETING AND CURATION
10.1 Editorial Features. Approved titles may be featured in Neesh Selects, curated collections, or promotional campaigns at Neesh's discretion. Placement is based on performance, Retailer engagement, and editorial fit.
10.2 No Exclusivity. Neesh does not require exclusivity. You retain full autonomy to distribute your magazine through other channels.
10.3 Paid Placements. You may purchase optional promotional placements in discovery feeds, seasonal catalogs, or targeted campaigns. Such placements are clearly labeled and priced separately.
10.4 Marketing Rights. By uploading Content, you grant Neesh a non-exclusive, worldwide, royalty-free license to use, reproduce, and display your Content for purposes of marketing, promoting, and operating the Platform. This license terminates upon account closure, except for Content incorporated into archival materials.
11. CONTENT STANDARDS AND CONDUCT
11.1 Content Accuracy. You represent and warrant that all Content:
(a) Accurately represents your magazine's content, price, format, and condition;
(b) Does not infringe upon any copyright, trademark, or other intellectual property rights;
(c) Complies with all applicable laws and regulations;
(d) Meets Neesh's quality, transparency, and retailer fit standards.
11.2 Prohibited Content. You may not list Content that:
(a) Contains illegal, defamatory, obscene, or harmful material;
(b) Violates third-party intellectual property rights;
(c) Misrepresents product specifications or availability;
(d) Contains malware, viruses, or other malicious code.
11.3 Enforcement. Neesh reserves the right to remove, hide, or delist any Content that violates these Terms or our community standards. Repeat violations may result in account suspension or termination.
12. INTELLECTUAL PROPERTY
12.1 Publisher IP. You retain all ownership rights in your Content. By uploading Content to the Platform, you grant Neesh a limited, non-exclusive, worldwide, royalty-free license to host, display, reproduce, and distribute your Content solely for purposes of operating and promoting the Platform.
12.2 Neesh IP. The Platform, including all software, designs, trademarks, and proprietary tools, is owned by Neesh and protected by intellectual property laws. You may not copy, modify, reverse engineer, or create derivative works based on the Platform without our prior written consent.
12.3 Feedback. If you provide suggestions, ideas, or feedback regarding the Platform, you grant Neesh a perpetual, irrevocable, worldwide license to use such feedback without compensation or attribution.
13. TERM AND TERMINATION
13.1 Term. These Terms remain in effect for as long as you maintain an active account on the Platform.
13.2 Termination by Publisher. You may deactivate your account at any time through the Platform settings or by contacting hi@neesh.art. Outstanding payouts will be processed in the next scheduled payout cycle.
13.3 Termination by Neesh. Neesh may suspend or terminate your account immediately if:
(a) You violate these Terms or any applicable law;
(b) You engage in fraudulent, abusive, or harmful conduct;
(c) You fail to maintain eligibility requirements;
(d) We are required to do so by law or court order.
13.4 Effect of Termination. Upon termination:
(a) Your access to the Platform will be revoked;
(b) Outstanding payouts will be processed subject to verification and deduction of any owed fees or damages;
(c) Your Content may be removed from the Platform;
(d) Sections 12, 14, 15, 16, and 17 will survive termination.
14. WARRANTIES AND DISCLAIMERS
14.1 Publisher Warranties. You represent and warrant that:
(a) You have the legal right to sell and distribute all listed inventory;
(b) All Content is accurate, complete, and non-infringing;
(c) You will comply with all applicable laws in connection with your use of the Platform.
14.2 Platform Disclaimer. THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. NEESH DOES NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
14.3 Third-Party Services. Neesh is not responsible for the performance, availability, or accuracy of third-party services including payment processors, shipping carriers, and 3PLs.
15. LIMITATION OF LIABILITY
15.1 Liability Cap. TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEESH'S TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE PLATFORM SHALL NOT EXCEED THE TOTAL FEES PAID BY YOU TO NEESH IN THE 12 MONTHS PRECEDING THE CLAIM.
15.2 Excluded Damages. IN NO EVENT SHALL NEESH BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
15.3 Exceptions. The limitations in this Section 15 do not apply to: (a) liability for gross negligence or willful misconduct; (b) liability that cannot be excluded by law; or (c) Publisher's indemnification obligations under Section 16.
15.4 Allocation of Risk. The limitations of liability reflect the allocation of risk between the parties and form an essential basis of the bargain.

16. INDEMNIFICATION
You agree to indemnify, defend, and hold harmless Neesh, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable attorneys' fees) arising from or related to:
(a) Your violation of these Terms;
(b) Your Content or inventory, including any claims of infringement or misrepresentation;
(c) Your breach of any representations or warranties;
(d) Your violation of any applicable law or regulation;
(e) Any disputes between you and Retailers.
17. DISPUTE RESOLUTION
17.1 Governing Law. These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles.
17.2 Arbitration. Any dispute arising from or relating to these Terms or the Platform shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall take place in New York, NY, and shall be conducted by a single arbitrator.
17.3 Class Action Waiver. You agree to bring claims only in your individual capacity and not as a plaintiff or class member in any class, consolidated, or representative proceeding.
17.4 Exceptions. Either party may seek injunctive or equitable relief in court to protect intellectual property rights or prevent irreparable harm.
17.5 Informal Resolution. Prior to initiating arbitration, you agree to contact Neesh at hi@neesh.art to attempt informal resolution for at least 30 days.
18. GENERAL PROVISIONS
18.1 Entire Agreement. These Terms, together with our Privacy Policy and any incorporated policies, constitute the entire agreement between you and Neesh regarding the Platform.
18.2 Severability. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
18.3 No Waiver. Neesh's failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
18.4 Assignment. You may not assign or transfer these Terms without Neesh's prior written consent. Neesh may assign these Terms without restriction.
18.5 Force Majeure. Neesh is not liable for any failure or delay in performance due to causes beyond our reasonable control, including but not limited to acts of God, war, terrorism, labor disputes, or internet outages.
18.6 Notices. All legal notices must be sent to hi@neesh.art. Notices to you will be sent to the email address associated with your account.
18.7 Relationship. Nothing in these Terms creates a partnership, joint venture, agency, or employment relationship between you and Neesh.
19. FUTURE FEATURES
Neesh may introduce additional features including but not limited to:
Inventory forecasting tools
Regional sell-through analytics
Advertising placement marketplace
Subscription management and pre-order capabilities
Direct-to-consumer storefront integration
Participation in beta features is optional and may require acceptance of additional terms.
20. CONTACT INFORMATION
For questions regarding these Terms, please contact:
Neesh Inc.
Email: hi@neesh.art
Website: neesh.art
By using the Neesh Platform, you acknowledge that you have read, understood, and agree to be bound by these Publisher Terms of Service.
IMPORTANT LEGAL NOTICE: These Terms constitute a legally binding agreement. We strongly recommend that you consult with legal counsel before accepting these Terms. If you do not agree to these Terms, you must not use the Platform.


TEXT;
@endphp

<pre class="terms-text">{!! nl2br(e($termsText)) !!}</pre>

           
            </pre>
        </div>

        <div class="terms-agree">
            <label class="checkbox-label">
                <input type="checkbox" id="agree_terms" name="agree_terms">
                <span>I have read and agree to the Neesh Publisher Terms of Service</span>
            </label>
        </div>

        <div class="terms-actions">
            <a href="{{ url()->previous() }}" class="btn-secondary">← Back</a>
            <a href="{{ route('register.publisher') }}" id="agreeBtn" class="btn-primary disabled">I Agree & Continue →</a>
        </div>
    </div>
</div>

<style>
/* --- Page Wrapper --- */
.terms-page-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    background: #f8f8f8;
    padding: 60px 20px;
}

/* --- Card Layout --- */
.terms-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    max-width: 900px;
    width: 100%;
    padding: 40px 50px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* --- Header --- */
.terms-header {
    text-align: center;
}
.neesh-logo {
    width: 70px;
    margin-bottom: 10px;
}
.terms-heading {
    font-size: 26px;
    font-weight: 700;
    color: #222;
}
.terms-updated {
    font-size: 13px;
    color: #777;
    margin-top: 4px;
}

/* --- Terms Content --- */
.terms-scroll {
    max-height: 450px;
    overflow-y: auto;
    background: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 20px;
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    white-space: pre-wrap;
}

.terms-scroll::-webkit-scrollbar {
    width: 8px;
}
.terms-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 6px;
}
.terms-scroll::-webkit-scrollbar-thumb:hover {
    background: #999;
}

/* --- Checkbox --- */
.terms-agree {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #333;
    cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
    width: 18px;
    height: 18px;
}

/* --- Buttons --- */
.terms-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 25px;
    flex-wrap: wrap;
    gap: 10px;
}

.btn-primary, .btn-secondary {
    padding: 10px 24px;
    border-radius: 8px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
}

.btn-primary {
    background: #000;
    color: #fff;
    border: none;
}
.btn-primary:hover:not(.disabled) {
    background: #fff;
    color: #000;
    border: 1px solid #000;
}

.btn-secondary {
    background: #f1f1f1;
    color: #333;
    border: 1px solid #ddd;
}
.btn-secondary:hover {
    background: #e4e4e4;
}

/* Disabled state */
.btn-primary.disabled {
    background: #ccc;
    color: #666;
    pointer-events: none;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const checkbox = document.getElementById('agree_terms');
    const agreeBtn = document.getElementById('agreeBtn');

    checkbox.addEventListener('change', function() {
        if (this.checked) {
            agreeBtn.classList.remove('disabled');
        } else {
            agreeBtn.classList.add('disabled');
        }
    });
});
</script>
@endsection
