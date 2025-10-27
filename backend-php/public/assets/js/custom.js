  document.getElementById('editAddressBtn').addEventListener('click', function() {
                document.getElementById('editAddressModal').style.display = 'block';
            });

            document.getElementById('closeModalBtn').addEventListener('click', function() {
                document.getElementById('editAddressModal').style.display = 'none';
            });

            // Optional: Close modal on outside click
            window.addEventListener('click', function(e) {
                const modal = document.getElementById('editAddressModal');
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });

            