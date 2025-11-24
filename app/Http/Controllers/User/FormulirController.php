<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\View;
use Dompdf\Dompdf;
use Dompdf\Options;

class FormulirController extends Controller
{
    /**
     * Display the registration form page.
     */
    public function index()
    {
        return Inertia::render('User/Formulir/Index');
    }

    /**
     * Download the registration form as PDF.
     */
    public function download()
    {
        $html = View::make('formulir.pendaftaran')->render();
        
        // Configure DomPDF options
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $options->set('isRemoteEnabled', true);
        $options->set('defaultFont', 'Times New Roman');
        $options->set('isPhpEnabled', false);
        $options->set('chroot', public_path());
        
        // Create DomPDF instance
        $dompdf = new Dompdf($options);
        $dompdf->loadHtml($html);
        $dompdf->setPaper('A4', 'portrait');
        $dompdf->render();
        
        // Return PDF as download
        return response()->streamDownload(function () use ($dompdf) {
            echo $dompdf->output();
        }, 'Formulir_Pendaftaran_PKBM_Dabohaley_2025-2026.pdf', [
            'Content-Type' => 'application/pdf',
        ]);
    }
}

