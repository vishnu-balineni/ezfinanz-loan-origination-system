const fs = require('fs');

try {
    let code = fs.readFileSync('src/pages/AuthPage.tsx', 'utf8');

    if (!code.includes('GoogleLogin')) {
        code = code.replace(
            `import { triggerCustomAlert } from '../components/shared/CustomAlertModal';`,
            `import { triggerCustomAlert } from '../components/shared/CustomAlertModal';\nimport { GoogleLogin } from '@react-oauth/google';\nimport { jwtDecode } from 'jwt-decode';`
        );
    }

    code = code.replace(/const handleGoogleOauth = async \(\) => \{[\s\S]*?catch \(err\) \{[\s\S]*?\}\n    \};\n?/m,
        `const handleGoogleOauthResponse = async (credentialResponse: any) => {
        try {
            const decoded: any = jwtDecode(credentialResponse.credential);
            triggerCustomAlert('success', \`Google Auth Verified for \${decoded.email}. Provisioning Account...\`, 'OAuth Success');
            
            const response = await fetch('https://exfinanz-backend.onrender.com/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: decoded.email, fullName: decoded.name, googleId: decoded.sub })
            });
            
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Google Integration failed');

            localStorage.setItem('user', JSON.stringify({
                id: data.userId, email: data.email, role: data.role, fullName: data.fullName, isKycVerified: data.isKycVerified, phone: data.phone || ''
            }));
            
            navigate('/dashboard');

        } catch (err: any) {
            triggerCustomAlert('error', err.response?.data?.error || err.message, 'Google Auth Error');
        }
    };
`);

    const newButton = `<GoogleLogin 
                                onSuccess={handleGoogleOauthResponse}
                                onError={() => triggerCustomAlert('error', 'Google Login Failed', 'Error')}
                                useOneTap
                            />`;

    code = code.replace(/<button\s+type="button"\s+onClick=\{handleGoogleOauth\}[\s\S]*?<\/button>/m, newButton);

    fs.writeFileSync('src/pages/AuthPage.tsx', code);
    console.log("PATCH_SUCCESS");
} catch (e) {
    console.error(e);
}
