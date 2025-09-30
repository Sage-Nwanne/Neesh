@extends('layouts.app')

@section('content')
<div class="container">
    <h2>Submit a Magazine</h2>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    <form action="{{ route('magazines.store') }}" method="POST" enctype="multipart/form-data">
        @csrf

        <div class="mb-3">
            <label class="form-label">Title Name</label>
            <input type="text" name="title_name" class="form-control" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Issue Identifier</label>
            <input type="text" name="issue_identifier" class="form-control" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Cover Image</label>
            <input type="file" name="cover_image" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">Additional Images</label>
            <input type="file" name="images[]" class="form-control" multiple>
        </div>
        <div class="mb-3">
    <label class="form-label">Logo</label>
    <input type="file" name="logo" class="form-control">
</div>

<div class="mb-3">
    <label class="form-label">Type</label>
    <select name="type" class="form-control">
        <option value="single_issue">Single Issue</option>
        <option value="series">Series</option>
    </select>
</div>

<div class="mb-3">
    <label class="form-label">Total Printed</label>
    <input type="number" name="total_printed" class="form-control" value="0">
</div>

<div class="mb-3">
    <label class="form-label">Restock Timeline</label>
    <input type="date" name="restock_timeline" class="form-control">
</div>

<div class="form-check mb-3">
    <input class="form-check-input" type="checkbox" name="visibility" value="1" checked>
    <label class="form-check-label">Visible</label>
</div>


        <div class="mb-3">
            <label class="form-label">Genre</label>
            <input type="text" name="genre" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">Description</label>
            <textarea name="description" class="form-control"></textarea>
        </div>

        <div class="mb-3">
            <label class="form-label">Dimensions</label>
            <input type="text" name="dimensions" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">Page Count</label>
            <input type="number" name="page_count" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">Stock</label>
            <input type="number" name="stock" class="form-control" value="0">
        </div>

        <div class="mb-3">
            <label class="form-label">Wholesale Price</label>
            <input type="text" name="wholesale_price" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">MSRP</label>
            <input type="text" name="msrp" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">Return Policy</label>
            <input type="text" name="return_policy" class="form-control">
        </div>

        <div class="mb-3">
            <label class="form-label">Retailer Fit Tags</label>
            <textarea name="retailer_fit_tags" class="form-control"></textarea>
        </div>

        <button type="submit" class="btn btn-primary">Submit Magazine</button>
    </form>
</div>
@endsection
