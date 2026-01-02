"use client";
import { useEffect, useState } from 'react';

const SENTINEL_URL = 'https://sentinel-anitbot-production.up.railway.app';

export function useSentinel(projectKey) {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBot, setIsBot] = useState(false);

    useEffect(() => {
        async function checkSentinel() {
            // Skip if no project key provided
            if (!projectKey) {
                console.warn('Sentinel: No project key provided');
                setLoading(false);
                return;
            }

            try {
                // Collect browser signals for bot detection
                const signals = {
                    webdriver: navigator.webdriver || false,
                    plugins: navigator.plugins?.length || 0,
                    languages: navigator.languages?.length || 0,
                    screen: {
                        width: screen.width,
                        height: screen.height
                    },
                    hardwareConcurrency: navigator.hardwareConcurrency || 0,
                    deviceMemory: navigator.deviceMemory || 0,
                    colorDepth: screen.colorDepth || 0,
                    maxTouchPoints: navigator.maxTouchPoints || 0,
                    chrome: !!window.chrome,
                    chromeRuntime: !!window.chrome?.runtime,
                };

                // Send check request to Sentinel API
                const response = await fetch(`${SENTINEL_URL}/api/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        projectKey,
                        userAgent: navigator.userAgent,
                        signals
                    })
                });

                const data = await response.json();
                setResult(data);

                console.log('Sentinel check result:', data);

                // Check if bot was detected and action is block
                if (data.action === 'block') {
                    setIsBot(true);
                    console.warn('Sentinel: Bot detected, redirecting...');

                    // Redirect bots to Google
                    setTimeout(() => {
                        window.location.href = 'https://google.com';
                    }, 1000);
                } else if (data.action === 'challenge') {
                    console.warn('Sentinel: Suspicious activity detected');
                    // You could show a CAPTCHA here in the future
                }

            } catch (error) {
                console.error('Sentinel check failed:', error);
                // Fail open - allow access if Sentinel is unreachable
                // This prevents legitimate users from being blocked due to network issues
            } finally {
                setLoading(false);
            }
        }

        checkSentinel();
    }, [projectKey]);

    return {
        result,
        loading,
        isBot,
        score: result?.score || 0,
        verdict: result?.verdict || 'unknown',
        confidence: result?.confidence || 'unknown'
    };
}
