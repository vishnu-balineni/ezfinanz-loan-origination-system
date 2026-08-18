import { execSync } from 'child_process'; try { execSync('npx tsc --noEmit', {stdio: 'pipe'}); console.log('OK'); } catch (e) { console.log(e.stdout.toString()); }
