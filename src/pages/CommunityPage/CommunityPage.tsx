import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MainLayout from '../../components/Layout/MainLayout';
import ParticleBackground from '../../components/ParticleBackground';
import './CommunityPage.css';

interface SocialPlatform {
  name: string;
  logo: string;
  qrCode?: string;
  link?: string;
  description: string;
}

const platforms: SocialPlatform[] = [
  {
    name: 'Discord',
    logo: '/community_channels/discord_logo.png',
    link: 'https://discord.gg/a6M6ckCRdM',
    description: "Hyperknow's Official Discord Channel"
  },
  {
    name: 'LinkedIn',
    logo: '/community_channels/linkedin_logo.png',
    link: 'https://www.linkedin.com/company/hyper-know',
    description: "Hyperknow's LinkedIn (Contact us if you'd like to be part of the team)"
  },
  {
    name: 'Instagram',
    logo: '/community_channels/instagram_logo.png',
    qrCode: '/community_channels/instagram_qrcode.png',
    description: "Hyperknow's Official Instagram Channel"
  },
  {
    name: 'WeChat',
    logo: '/community_channels/wechat_logo.png',
    qrCode: '/community_channels/wechat_qrcode.jpg',
    description: "Hyperknow's WeChat Group"
  },
  {
    name: 'Red Note',
    logo: '/community_channels/rednote_logo.png',
    qrCode: '/community_channels/rednote_qrcode.svg',
    description: "Hyperknow's Red Note"
  }
];

const CommunityPage = () => {
  const [flippedCard, setFlippedCard] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent initial animation by waiting for component mount
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return (
      <MainLayout>
        <div className="community-container">
          <div className="community-header">
            <h1 className="page-title">Join Our Community</h1>
            <p className="page-subtitle">Connect with us across different platforms</p>
          </div>
          <div className="platforms-grid">
            {platforms.map((platform) => (
              <div key={platform.name} className="platform-card">
                <div className="card-face card-front">
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="platform-logo"
                  />
                  <h3 className="platform-name">{platform.name}</h3>
                </div>
                <div className="card-face card-back" />
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="community-container">
        <div className="community-content">
          <ParticleBackground />
          
          <div className="community-header">
            <h1 className="page-title">Join Our Community</h1>
            <p className="page-subtitle">Connect with us across different platforms</p>
          </div>

          <div className="platforms-grid">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className={`platform-card ${flippedCard === platform.name ? 'is-flipped' : ''}`}
                onClick={() => setFlippedCard(flippedCard === platform.name ? null : platform.name)}
              >
                <div className="card-face card-front">
                  <img 
                    src={platform.logo} 
                    alt={platform.name} 
                    className="platform-logo"
                  />
                  <h3 className="platform-name">{platform.name}</h3>
                </div>
                <div className="card-face card-back">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlippedCard(null);
                    }}
                    className="close-button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {platform.qrCode ? (
                    <>
                      <img 
                        src={platform.qrCode} 
                        alt={`${platform.name} QR Code`} 
                        className="qr-code"
                      />
                      <p className="scan-text">Scan to Join</p>
                    </>
                  ) : platform.link ? (
                    <>
                      <p className="join-text">{platform.description}</p>
                      <a 
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="join-button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join Now
                      </a>
                    </>
                  ) : (
                    <p className="join-text">{platform.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;