<!doctype html>
<html>

<head>
    <meta charset="utf-8" />
    <title>Electric Bill Receipt</title>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");

        /* Base font for all elements */
        * {
            font-family: "Poppins", Arial, sans-serif;
            color: #000;
        }

        body {
            font-size: 12px;
            margin: 0;
            padding: 20px;
            background-color: white;
            font-weight: 400;
            font-style: normal;
        }

        .a4-wrapper {
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
            max-width: 210mm;
        }

        /* Header Section */
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .header-row {
            display: table-row;
        }

        .header-cell {
            display: table-cell;
            vertical-align: bottom;
        }

        .header-cell.right {
            text-align: right;
        }

        .header-title {
            font-weight: 700;
            font-size: 20px;
            margin: 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .header-text {
            font-size: 14px;
            font-weight: 400;
            margin: 5px 0 0 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .header-bold {
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }

        /* Receipt Section */
        .receipt-table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0 20px 0;
        }

        .receipt-cell {
            display: table-cell;
            vertical-align: top;
        }

        .receipt-title {
            font-size: 14px;
            font-weight: 400;
            margin: 0 0 5px 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .receipt-bold {
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }

        .total-red {
            color: red;
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }

        /* Details Section */
        .details-section {
            margin: 40px 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid black;
        }

        .details-title {
            font-size: 15px;
            font-weight: 700;
            margin: 0 0 10px 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .details-subtitle {
            font-size: 15px;
            font-weight: 400;
            margin: 10px 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .reading-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }

        .reading-row {
            display: table-row;
        }

        .reading-cell {
            display: table-cell;
            vertical-align: top;
            padding: 2px 0;
            font-size: 14px;
            font-weight: 400;
            font-family: "Poppins", Arial, sans-serif;
        }

        .reading-cell.left {
            width: 50%;
        }

        .reading-cell.right {
            width: 50%;
            text-align: left;
        }

        .reading-inner-table {
            width: 80%;
            border-collapse: collapse;
        }

        .reading-inner-cell {
            display: table-cell;
            vertical-align: top;
            font-size: 14px;
            font-weight: 400;
            font-family: "Poppins", Arial, sans-serif;
        }

        .total-bill {
            font-weight: 700;
            margin: 20px 0;
            text-align: right;
            font-size: 15px;
            font-family: "Poppins", Arial, sans-serif;
        }

        /* Payments Section */
        .payments-section {
            margin: 50px 0 30px 0;
        }

        .payments-title {
            font-size: 15px;
            font-weight: 700;
            margin: 0 0 15px 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .gcash-text {
            font-size: 14px;
            line-height: 1.8;
            margin: 10px 0;
            text-align: center;
            font-weight: 400;
            font-family: "Poppins", Arial, sans-serif;
        }

        .gcash-text b {
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }

        .payment-note {
            text-align: center;
            font-size: 12px;
            margin: 5px 0;
            font-weight: 400;
            font-family: "Poppins", Arial, sans-serif;
        }

        .payment-note b {
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }

        .center-wrapper {
            width: 100%;
            text-align: center;
        }

        .center-content {
            display: inline-block;
            width: 70%;
            text-align: center;
        }

        /* Slip Section */
        .slip-section {
            margin: 50px 0 30px 0;
            padding-top: 20px;
            border-top: 1px dashed black;
        }

        .slip-title {
            text-align: center;
            font-weight: 400;
            font-size: 12px;
            margin: 0 0 20px 0;
            font-family: "Poppins", Arial, sans-serif;
        }

        .form-table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
        }

        .form-row {
            display: table-row;
        }

        .form-cell {
            display: table-cell;
            vertical-align: bottom;
        }

        .form-cell:first-child() {
            padding-right: 50px;
        }

        .form-cell:last-child() {
            padding-left: 50px;
        }

        /* Form line styling */
        .form-line {
            display: flex;
            align-items: center;
            width: 100%;
        }

        .form-line.right {
            justify-content: flex-end;
        }

        .form-label {
            margin: 0;
            padding: 0;
            white-space: nowrap;
            font-size: 12px;
            font-weight: 400;
            font-family: "Poppins", Arial, sans-serif;
            margin-right: 5px;
        }

        .underline-full {
            flex: 1;
            height: 14px;
            border-top: 1px solid black;
            margin-left: 0px;
            min-width: 150px;
        }

        /* Notice Section */
        .notice-section {
            text-align: center;
            font-size: 12px;
            margin: 50px 0 0 0;
            font-weight: 400;
            font-family: "Poppins", Arial, sans-serif;
        }

        .notice-section b {
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }

        /* Make all bold/strong elements use font-weight 700 */
        b,
        strong {
            font-weight: 700 !important;
            font-family: "Poppins", Arial, sans-serif !important;
        }

        /* Ensure all headings have proper font */
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            font-family: "Poppins", Arial, sans-serif;
            font-weight: 400;
        }

        /* Alternative approach: Use a span class for consistent bold styling */
        .bold {
            font-weight: 700;
            font-family: "Poppins", Arial, sans-serif;
        }
    </style>
</head>

<body>
    <div class="a4-wrapper">
        <!-- Header Section -->
        <table class="header-table">
            <tr class="header-row">
                <td class="header-cell">
                    <h2 class="header-title">
                        Submeter {{ $bill->unit->submeter_number ?? 'N/A' }}
                    </h2>
                    <h2 class="header-text">
                        Tenant: {{ $bill->unit->tenant_name ?? 'N/A' }}
                    </h2>
                </td>
                <td class="header-cell right">
                    <h2 class="header-text">{{ $billDate ?? date('F d,Y') }}</h2>
                    <h2 class="header-text">
                        Bill for:
                        <span class="bold">{{ $formattedMonth ?? date('F Y') }}</span>
                    </h2>
                </td>
            </tr>
        </table>

        <!-- Bill Receipt -->
        <table class="receipt-table">
            <tr class="receipt-row">
                <td class="receipt-cell">
                    <h1 class="receipt-title">
                        Bill Receipt:
                        <span class="bold">
                            P{{ number_format(optional($billReceipt)->total_bill ?? 0, 2) }}</span>
                    </h1>
                    <h1 class="receipt-title">
                        Due Date:
                        <span class="bold">{{ $dueDate ?? date('F d,Y', strtotime('+15 days')) }}</span>
                    </h1>
                </td>
                <td class="receipt-cell" style="text-align: right">
                    <h1 class="receipt-title">
                        Total Bill:
                        <span class="total-red">P{{ number_format($bill->total_amount, 2) }}</span>
                    </h1>
                </td>
            </tr>
        </table>

        <!-- Details Section -->
        <div class="details-section">
            <h1 class="details-title">Electricity Consumption Details</h1>
            <h2 class="details-subtitle">Reading:</h2>

            <table class="reading-table">
                <tr class="reading-row">
                    <td class="reading-cell left">
                        <table class="reading-inner-table">
                            <tr>
                                <td class="reading-inner-cell">
                                    {{ $previousMonthFormatted ?? 'Previous Month' }}
                                </td>
                                <td class="reading-inner-cell" style="text-align: right">
                                    {{ $bill->previous_reading ?? '0' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td class="reading-cell right">
                        <span>Total Consumption:</span>
                        <span>{{ $bill->total_consumption ?? '0' }} kWh</span>
                    </td>
                </tr>
            </table>

            <table class="reading-table">
                <tr class="reading-row">
                    <td class="reading-cell left">
                        <table class="reading-inner-table">
                            <tr>
                                <td class="reading-inner-cell">
                                    {{ $formattedMonth ?? 'Previous Month' }}
                                </td>
                                <td class="reading-inner-cell" style="text-align: right">
                                    {{ $bill->current_reading ?? '0' }}
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td class="reading-cell right">
                        <span>Rate per kWh:</span>
                        <span> P{{ number_format($bill->rate, 2) }}</span>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Total Bill -->
        <div class="total-bill">
            Total Bill: P{{ number_format($bill->total_amount, 2) }}
        </div>

        <!-- Payments Section -->
        <div class="payments-section">
            <h1 class="payments-title">Payment Methods</h1>
            <div class="center-wrapper">
                <div class="center-content">
                    <p class="gcash-text">
                        <span class="bold">Gcash: 09919226260</span> John Clyde Ongchad
                    </p>
                    <p class="payment-note">
                        Please message <span class="bold">MJ Ongchad</span> in messenger
                        the screenshot of payment if Gcash
                    </p>
                </div>
            </div>
        </div>

        <!-- Slip Section -->
        <div class="slip-section">
            <table class="header-table">
                <tr class="header-row">
                    <td class="header-cell">
                        <h2 class="header-text">
                            Bill for:
                            <span class="bold">{{ $formattedMonth ?? date('F Y') }}</span>
                        </h2>
                    </td>
                    <td class="header-cell right">
                        <h2 class="header-text">
                            Submeter No:
                            <span class="bold">
                                {{ $bill->unit->submeter_number ?? 'N/A' }}</span>
                        </h2>
                    </td>
                </tr>
            </table>
            <h1 class="slip-title">( For cash payments only )</h1>

            <table class="form-table">
                <tr class="form-row">
                    <td class="form-cell">
                        <div class="form-line">
                            <span class="form-label">Name:</span>
                            <div class="underline-full"></div>
                        </div>
                    </td>
                    <td class="form-cell">
                        <div class="form-line right">
                            <span class="form-label">Date:</span>
                            <div class="underline-full"></div>
                        </div>
                    </td>
                </tr>
            </table>

            <table class="form-table">
                <tr class="form-row">
                    <td class="form-cell">
                        <div class="form-line">
                            <span class="form-label">Cash Amount:</span>
                            <div class="underline-full"></div>
                        </div>
                    </td>
                    <td class="form-cell">
                        <div class="form-line right">
                            <span class="form-label">Bill Amount:
                                <b>P{{ number_format($bill->total_amount, 2) }}</b></span>
                            <div class="underline-full"></div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Notice Section -->
        <div class="notice-section">
            <p>
                <span class="bold">Notice:</span> This portion serves as the payment
                slip and
                <span class="bold">must be submitted together with the cash payment</span>
                for the electric bill.
            </p>
        </div>
    </div>
</body>

</html>
