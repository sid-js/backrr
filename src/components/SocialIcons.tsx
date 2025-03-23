'use client';

import { Twitter, Instagram, Youtube, Linkedin, Globe } from 'lucide-react';

type IconProps = {
  size?: number;
  color?: string;
  className?: string;
};

export const getSocialIcon = (url: string, props: IconProps = {}) => {
  const { size = 20, color = 'currentColor', className = '' } = props;
  
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return <Twitter size={size} color={color} className={className} />;
  } else if (url.includes('instagram.com')) {
    return <Instagram size={size} color={color} className={className} />;
  } else if (url.includes('youtube.com')) {
    return <Youtube size={size} color={color} className={className} />;
  } else if (url.includes('linkedin.com')) {
    return <Linkedin size={size} color={color} className={className} />;
  } else {
    return <Globe size={size} color={color} className={className} />;
  }
};