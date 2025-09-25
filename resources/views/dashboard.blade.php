<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div class="p-6 text-gray-900">
                    <h1>Dashboard</h1>

                    @role('admin')
                        <p>You are an Admin — full access.</p>
                    @endrole

                    @role('publisher')
                        <p>You are a Publisher — you can upload and manage content.</p>
                    @endrole

                    @role('retailer')
                        <p>You are a Retailer — you can browse and order products.</p>
                    @endrole
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
