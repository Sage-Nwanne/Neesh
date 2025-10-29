@extends('layouts.app')

@section('content')
<div class="settings-container">
    <div class="settings-header">
        <h1>Profile Settings</h1>
        <p>Manage your publisher profile and account information</p>
    </div>

    <div class="settings-content">
        <!-- Sidebar Navigation -->
        <aside class="settings-sidebar">
            <nav class="settings-nav">
                <a href="#profile" class="nav-item active" data-section="profile">
                    <span class="icon">👤</span>
                    <span>Profile Information</span>
                </a>
                <a href="#branding" class="nav-item" data-section="branding">
                    <span class="icon">🎨</span>
                    <span>Branding</span>
                </a>
                <a href="#social" class="nav-item" data-section="social">
                    <span class="icon">🔗</span>
                    <span>Social Media</span>
                </a>
                <a href="#security" class="nav-item" data-section="security">
                    <span class="icon">🔒</span>
                    <span>Security</span>
                </a>
            </nav>
        </aside>

        <!-- Main Settings Content -->
        <main class="settings-main">
            <!-- Profile Information Section -->
            <section id="profile" class="settings-section active">
                <h2>Profile Information</h2>
                <form id="profileForm" class="settings-form">
                    @csrf
                    <div class="form-group">
                        <label for="company_name">Company Name</label>
                        <input type="text" id="company_name" name="company_name" 
                               value="{{ $publisher->company_name }}" required>
                    </div>

                    <div class="form-group">
                        <label for="description">Description</label>
                        <textarea id="description" name="description" rows="4" 
                                  placeholder="Tell us about your publishing company...">{{ $publisher->description }}</textarea>
                    </div>

                    <div class="form-group">
                        <label for="website">Website</label>
                        <input type="url" id="website" name="website" 
                               value="{{ $publisher->website }}" placeholder="https://example.com">
                    </div>

                    <div class="form-group">
                        <label for="phone">Phone</label>
                        <input type="tel" id="phone" name="phone" 
                               value="{{ $publisher->phone }}" placeholder="+1 (555) 000-0000">
                    </div>

                    <button type="submit" class="btn-save">Save Changes</button>
                </form>
            </section>

            <!-- Branding Section -->
            <section id="branding" class="settings-section">
                <h2>Branding</h2>
                <form id="brandingForm" class="settings-form" enctype="multipart/form-data">
                    @csrf
                    <div class="form-group">
                        <label>Logo</label>
                        <div class="logo-upload">
                            @if($publisher->logo)
                                <div class="logo-preview">
                                    <img src="{{ asset('storage/' . $publisher->logo) }}" alt="Logo">
                                </div>
                            @endif
                            <div class="upload-area">
                                <input type="file" id="logo" name="logo" accept="image/*">
                                <label for="logo" class="upload-label">
                                    <span class="upload-icon">📤</span>
                                    <span>Click to upload or drag and drop</span>
                                    <span class="upload-hint">PNG, JPG, GIF up to 2MB</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="btn-save">Update Branding</button>
                </form>
            </section>

            <!-- Social Media Section -->
            <section id="social" class="settings-section">
                <h2>Social Media</h2>
                <form id="socialForm" class="settings-form">
                    @csrf
                    @php
                        $socials = $publisher->social_media ? 
                            (is_string($publisher->social_media) ? json_decode($publisher->social_media, true) : $publisher->social_media) 
                            : [];
                    @endphp

                    <div class="form-group">
                        <label for="facebook">Facebook</label>
                        <input type="url" id="facebook" name="social_media[facebook]" 
                               value="{{ $socials['facebook'] ?? '' }}" placeholder="https://facebook.com/yourpage">
                    </div>

                    <div class="form-group">
                        <label for="twitter">Twitter</label>
                        <input type="url" id="twitter" name="social_media[twitter]" 
                               value="{{ $socials['twitter'] ?? '' }}" placeholder="https://twitter.com/yourhandle">
                    </div>

                    <div class="form-group">
                        <label for="instagram">Instagram</label>
                        <input type="url" id="instagram" name="social_media[instagram]" 
                               value="{{ $socials['instagram'] ?? '' }}" placeholder="https://instagram.com/yourprofile">
                    </div>

                    <div class="form-group">
                        <label for="linkedin">LinkedIn</label>
                        <input type="url" id="linkedin" name="social_media[linkedin]" 
                               value="{{ $socials['linkedin'] ?? '' }}" placeholder="https://linkedin.com/company/yourcompany">
                    </div>

                    <button type="submit" class="btn-save">Save Social Links</button>
                </form>
            </section>

            <!-- Security Section -->
            <section id="security" class="settings-section">
                <h2>Security</h2>
                <div class="security-info">
                    <div class="security-item">
                        <h3>Change Password</h3>
                        <p>Update your password to keep your account secure</p>
                        <a href="{{ route('password.request') }}" class="btn-secondary">Change Password</a>
                    </div>

                    <div class="security-item">
                        <h3>Two-Factor Authentication</h3>
                        <p>Add an extra layer of security to your account</p>
                        <button class="btn-secondary" disabled>Coming Soon</button>
                    </div>

                    <div class="security-item">
                        <h3>Active Sessions</h3>
                        <p>Manage your active login sessions</p>
                        <button class="btn-secondary" disabled>Coming Soon</button>
                    </div>
                </div>
            </section>
        </main>
    </div>
</div>

<style>
.settings-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    font-family: 'Manrope', sans-serif;
}

.settings-header {
    margin-bottom: 40px;
}

.settings-header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 10px;
}

.settings-header p {
    color: #666;
    font-size: 16px;
}

.settings-content {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 40px;
}

.settings-nav {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    text-decoration: none;
    color: #666;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    cursor: pointer;
}

.nav-item:hover {
    background: #f0f0f0;
    color: #753bbd;
}

.nav-item.active {
    background: #753bbd;
    color: white;
}

.nav-item .icon {
    font-size: 18px;
}

.settings-section {
    display: none;
    background: white;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.settings-section.active {
    display: block;
}

.settings-section h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 30px;
    color: #1a1a1a;
}

.settings-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1a1a1a;
}

.form-group input,
.form-group textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: 'Manrope', sans-serif;
    font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #753bbd;
    box-shadow: 0 0 0 3px rgba(117, 59, 189, 0.1);
}

.logo-upload {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.logo-preview {
    width: 120px;
    height: 120px;
    border-radius: 8px;
    overflow: hidden;
    background: #f0f0f0;
}

.logo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-area {
    flex: 1;
    position: relative;
}

.upload-area input[type="file"] {
    display: none;
}

.upload-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    border: 2px dashed #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
}

.upload-label:hover {
    border-color: #753bbd;
    background: rgba(117, 59, 189, 0.05);
}

.upload-icon {
    font-size: 32px;
    margin-bottom: 10px;
}

.upload-hint {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}

.btn-save, .btn-secondary {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Manrope', sans-serif;
    align-self: flex-start;
}

.btn-save {
    background: #753bbd;
    color: white;
}

.btn-save:hover {
    background: #5a2d8f;
}

.btn-secondary {
    background: #f0f0f0;
    color: #1a1a1a;
}

.btn-secondary:hover:not(:disabled) {
    background: #e0e0e0;
}

.btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.security-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.security-item {
    padding: 20px;
    background: #f9f9f9;
    border-radius: 8px;
    border-left: 4px solid #753bbd;
}

.security-item h3 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1a1a1a;
}

.security-item p {
    color: #666;
    font-size: 14px;
    margin-bottom: 15px;
}

@media (max-width: 768px) {
    .settings-content {
        grid-template-columns: 1fr;
    }

    .settings-nav {
        flex-direction: row;
        overflow-x: auto;
    }

    .nav-item {
        white-space: nowrap;
    }
}
</style>

<script>
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.dataset.section;
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Update active section
        document.querySelectorAll('.settings-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    });
});

// Handle form submissions
document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    try {
        const response = await fetch('{{ route("profile.update-publisher") }}', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value
            }
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Profile updated successfully!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update profile');
    }
});
</script>
@endsection

