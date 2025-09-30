import Link from "next/link";
import React from "react";
import { Calendar, Mail, Github, Heart, MessageCircle, ExternalLink, User } from "lucide-react";
import { contactConfig } from "@/lib/config/contact.config";
import { footerConfig } from "@/lib/config/footer.config";

/**
 * Footer组件属性接口
 */
interface FooterProps {
  authors: Array<{ name: string; link: string }>;
}

/**
 * 页脚组件
 * 在Next.js 13+的App Router中，此组件作为客户端组件，通过props接收数据
 */
export function Footer({ authors }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-secondary/30 to-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-foreground">{footerConfig.brand.name}</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              {footerConfig.brand.description}
            </p>
            {/* 作者信息 */}
            {authors.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                <div className="flex flex-wrap items-center gap-2">
                  <User className="h-4 w-4 shrink-0" />
                  <span className="shrink-0">作者:</span>
                  {authors.map((author, index) => (
                    <React.Fragment key={index}>
                      {index > 0 && <span className="text-muted-foreground">, </span>}
                      <a
                        href={author.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline transition-colors whitespace-nowrap"
                      >
                        {author.name}
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center space-x-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-destructive" />
              <span>{footerConfig.brand.slogan}</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              快速链接
            </h3>
            <ul className="mt-4 space-y-3">
              {footerConfig.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Friendly Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              友情链接
            </h3>
            <ul className="mt-4 space-y-3">
              {footerConfig.friendlyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
              联系我们
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{contactConfig.email}</span>
              </li>
              <li>
                <a
                  href={contactConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              </li>
              {contactConfig.qqGroups.map((group, index) => (
                <li key={index}>
                  <a
                    href={group.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{group.name}: {group.number}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {footerConfig.copyright.replace('{year}', currentYear.toString())}
            </p>
            <p className="text-sm text-muted-foreground mt-2 md:mt-0">
              {footerConfig.platformName}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}