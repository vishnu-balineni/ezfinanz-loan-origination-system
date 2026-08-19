import fs from 'fs';
let code = fs.readFileSync('src/pages/AuthPage.tsx', 'utf8');

const newDiv = `<div className="auth-social-mock" style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <GoogleLogin 
            onSuccess={handleGoogleOauthResponse}
            onError={() => triggerCustomAlert('error', 'Google Login Failed', 'Error')}
            useOneTap
            size="large"
            theme="outline"
            width="100%"
        />
        <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
            <span style={{ padding: '0 0.5rem', color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#cbd5e1' }}></div>
        </div>
    </div>`;

code = code.replace(/<div className="auth-social-mock"[\s\S]*?<\/button>[\s\S]*?<\/div>[\s\S]*?<\/div>/m, newDiv);

fs.writeFileSync('src/pages/AuthPage.tsx', code);
