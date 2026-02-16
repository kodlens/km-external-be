// import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ConfigProvider, App as AntApp} from 'antd';
import { StrictMode } from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const queryClient = new QueryClient()

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
          <StrictMode>
            <ConfigProvider
                theme={{
                    components: {
                        Input: {
                            // activeBorderColor: "#06750b"
                        },

                        Button: {
                            // defaultBg: '#244a3d',
                            // defaultActiveBg: '#3d8069', //color when hover after click
                            // defaultHoverBorderColor: '#244a3d',
                            // defaultHoverColor: 'white', //Text color of default button when hover
                            // linkHoverBg: '#244a3d', //Background color of link button when hover
                            // defaultHoverBg: '#1b382e', //Background color of default button when hover

                            // defaultActiveBorderColor: '#244a3d',
                            // defaultGhostBorderColor: '#244a3d',
                            // textHoverBg: 'white', //	Background color of text button when hover
                            // primaryColor: '#244a3d',
                            // defaultColor: 'white'
                        },
                        Layout: {
                            headerBg: 'white', //Background Color of header
                        },

                    },
                    token: {
                        // Seed Token
                        // colorPrimary: '#244a3d',
                        // borderRadius: 2,


                        // Alias Token
                        // colorBgContainer: '#ffff',
                        fontFamily: 'Poppins, sans-serif',
                    },

            }}>

                <AntApp>
                  <QueryClientProvider client={queryClient}>
                    <App {...props} />
                  </QueryClientProvider>
                </AntApp>



            </ConfigProvider>
          </StrictMode>

        );
    },
    progress: {
        color: '#4B5563',
    },
});
