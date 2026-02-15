"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ExternalLink,
  Github,
  Linkedin,
  MapPin,
  GraduationCap,
  Heart,
  ChevronDown,
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSf8jjgUoocAqTmnFxuqNiUGeRmjdY1931C_3YJSFyscA7Dx4A/viewform?embedded=true";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const categoryMeta: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  フロントエンド: { icon: Code2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  バックエンド: { icon: Server, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  データベース: { icon: Database, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  DevOps: { icon: Cloud, color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  その他: { icon: Wrench, color: "text-rose-400", bg: "bg-rose-500/10 border-rose-500/20" },
};

const skillCategories = [
  {
    name: "フロントエンド",
    skills: ["TypeScript", "React", "Next.js", "Vue.js", "Nuxt", "Svelte", "SvelteKit", "Tauri", "React Native", "Flutter"],
  },
  {
    name: "バックエンド",
    skills: ["Rust", "Python", "Axum", "FastAPI", "Django", "REST API"],
  },
  {
    name: "データベース",
    skills: ["MySQL", "PostgreSQL", "DynamoDB"],
  },
  {
    name: "DevOps",
    skills: ["Docker", "CI/CD", "AWS", "CloudFormation"],
  },
  {
    name: "その他",
    skills: ["Go", "C++", "kafka", "EMQX"],
  },
];

function SectionSeparator() {
  return (
    <div className="flex justify-center">
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setActiveSection(id);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about me", "projects", "skills", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) {
        setActiveSection(current);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] scroll-progress z-[60] origin-left"
        style={{ scaleX }}
      />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <button
            onClick={() => scrollTo("home")}
            className="text-xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            YT.
          </button>
          <ul className="flex space-x-1">
            {["home", "about me", "projects", "skills", "contact"].map((section) => (
              <li key={section}>
                <button
                  onClick={() => scrollTo(section)}
                  className={`relative px-3 py-2 text-sm uppercase tracking-wider transition-colors duration-300 rounded-md ${
                    activeSection === section
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {section}
                  {activeSection === section && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        {/* Background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl animate-float animate-pulse-glow" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-pink-600/15 blur-3xl animate-float-delayed animate-pulse-glow" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl animate-float-slow animate-pulse-glow" />
          {/* Dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <motion.div
          className="text-center z-10 px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={scaleIn}>
            <Avatar className="w-36 h-36 mx-auto mb-8 ring-4 ring-purple-500/50 ring-offset-4 ring-offset-gray-950 shadow-2xl shadow-purple-500/20">
              <AvatarImage src="https://github.com/yuya-take.png" alt="Yuya Takemasa" />
              <AvatarFallback>YT</AvatarFallback>
            </Avatar>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-lg text-purple-300 mb-3 tracking-widest uppercase">
            Full Stack Developer
          </motion.p>

          <motion.h1 variants={fadeInUp} className="text-6xl md:text-7xl font-bold mb-4 text-gradient">
            Yuya Takemasa
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl text-gray-400 mb-10 max-w-lg mx-auto">
            ソフトウェアとハードウェアの両面から、価値あるプロダクトを創る
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Button
              onClick={() => scrollTo("about me")}
              className="rounded-full bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 shadow-lg shadow-purple-600/25 transition-all duration-300 hover:shadow-purple-500/40"
            >
              詳しく見る
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </motion.div>
      </section>

      <SectionSeparator />

      {/* About Me */}
      <section id="about me" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-16 text-center text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            About Me
          </motion.h2>

          {/* Profile mini cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/80 border-gray-800/50 hover:border-purple-500/30 transition-colors">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-2.5 rounded-xl bg-purple-500/10">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">出身地</p>
                    <p className="text-gray-200 font-medium">千葉県</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/80 border-gray-800/50 hover:border-pink-500/30 transition-colors">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-2.5 rounded-xl bg-pink-500/10">
                    <Heart className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">趣味</p>
                    <p className="text-gray-200 font-medium">ゴルフ・旅行</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-900/80 border-gray-800/50 hover:border-indigo-500/30 transition-colors">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">学歴</p>
                    <p className="text-gray-200 font-medium text-sm">千葉大学大学院 修士課程修了</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Career subsections */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="border-l-2 border-purple-500/50 pl-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Academic</h3>
              <p className="text-gray-400 leading-relaxed">
                大学時代には、Pythonを使って実験装置を制御するプログラムを開発し、
                実験結果の分析やデータ処理を行うほか、必要に応じて回路設計も手がけるなど、
                ソフトウェアとハードウェアの両面で経験を積んできました。
                また、C++を用いたシミュレーションにより、実験結果と理想的な値との差を確認し、
                実験対象となる装置の校正を行うことにも取り組みました。
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="border-l-2 border-pink-500/50 pl-6">
              <h3 className="text-lg font-semibold text-pink-400 mb-2">Career</h3>
              <p className="text-gray-400 leading-relaxed">
                その後、ITエンジニアとしてのキャリアをスタートし、フロントエンド・バックエンド、さらにはインフラまで幅広く対応しています。
                フロントエンドではReactやNext.jsを活用し、デザインと使いやすさを両立させたインターフェースを作成。
                バックエンドでは、RustやPythonを使ってスケーラブルなシステムの構築に取り組んでいます。
                また、DockerやCI/CDの仕組みを取り入れ、環境構築やデプロイの効率化にも注力しています。
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="border-l-2 border-indigo-500/50 pl-6">
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Philosophy</h3>
              <p className="text-gray-400 leading-relaxed">
                実務を通じてスキルを着実に磨きながら、プロジェクトに価値を提供できるよう日々努力しています。
                また新しい技術やアイデアに常にオープンで、チームと協力しながらより良い結果を追求することを心がけています。
                エンジニアとして技術を磨きつつ、プロジェクトに積極的に貢献する姿勢を持って取り組んでいます。
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <SectionSeparator />

      {/* Projects */}
      <section id="projects" className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <motion.h2
            className="text-4xl font-bold mb-16 text-center text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Projects
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Gradient border trick */}
            <div className="p-px rounded-2xl bg-gradient-to-br from-purple-500/50 via-transparent to-pink-500/50">
              <Card className="bg-gray-900 rounded-2xl border-none overflow-hidden">
                {/* Accent bar */}
                <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-white mb-2">ScoreScreen AI</CardTitle>
                      <p className="text-gray-400 text-lg">
                        野球スコアブックをデジタル化し、AIがデータを分析するiOSアプリ
                      </p>
                    </div>
                    <a
                      href="https://scorescreen-ai-lp.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      <ArrowUpRight className="w-5 h-5 text-purple-400" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-gray-400 leading-relaxed">
                    「スコアをつける」から「スコアで戦う」へ。チーム管理・試合記録・AI分析を一つのアプリに統合し、チーム戦略と選手の成長をデータの力でサポートします。
                  </p>

                  {/* Feature mini cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { title: "チーム管理", desc: "チーム作成・選手登録・役割管理" },
                      { title: "デジタル記録", desc: "試合作成からスコア入力・結果記録" },
                      { title: "AI分析", desc: "自動解析・レポート生成・戦略提案" },
                    ].map((feature) => (
                      <div
                        key={feature.title}
                        className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50"
                      >
                        <p className="text-sm font-semibold text-purple-300 mb-1">{feature.title}</p>
                        <p className="text-xs text-gray-500">{feature.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {["iOS", "AI", "スポーツテック"].map((tech) => (
                      <Badge
                        key={tech}
                        className="bg-purple-500/15 text-purple-300 border border-purple-500/20 hover:bg-purple-500/25 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <a
                    href="https://scorescreen-ai-lp.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    ランディングページを見る
                  </a>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      <SectionSeparator />

      {/* Skills */}
      <section id="skills" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-16 text-center text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Skills
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {skillCategories.map((category) => {
              const meta = categoryMeta[category.name];
              const IconComponent = meta.icon;
              return (
                <motion.div key={category.name} variants={scaleIn}>
                  <Card className="bg-gray-900/80 border-gray-800/50 hover:bg-gray-800/60 transition-all duration-300 h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${meta.bg} border`}>
                          <IconComponent className={`w-4 h-4 ${meta.color}`} />
                        </div>
                        <span className={`text-base font-semibold ${meta.color}`}>{category.name}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                          <Badge
                            key={skill}
                            variant="secondary"
                            className="bg-gray-800/80 text-gray-300 border border-gray-700/50 hover:scale-105 transition-transform cursor-default"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <SectionSeparator />

      {/* Contact */}
      <section id="contact" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl font-bold mb-16 text-center text-gradient"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Contact
          </motion.h2>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Description + social */}
            <motion.div variants={fadeInUp} className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Get in Touch</h3>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-lg mx-auto">
                お仕事のご相談やご質問など、お気軽にお問い合わせください。以下のフォームまたはSNSからどうぞ。
              </p>
              <div className="flex gap-3 justify-center">
                <a
                  href="https://github.com/yuya-take"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-gray-700/50 hover:border-purple-500/50 text-gray-400 hover:text-purple-400 transition-all duration-300"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/in/yuya-takemasa-456763285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full border border-gray-700/50 hover:border-purple-500/50 text-gray-400 hover:text-purple-400 transition-all duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Google Form embed */}
            <motion.div variants={fadeInUp} className="flex justify-center">
              <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-800/50">
                <iframe
                  src={GOOGLE_FORM_URL}
                  width="100%"
                  height="600"
                  className="bg-transparent"
                  title="お問い合わせフォーム"
                >
                  読み込み中…
                </iframe>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Yuya Takemasa. All rights reserved.</p>
          <div className="flex gap-6">
            <a
              href="https://github.com/yuya-take"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/yuya-takemasa-456763285"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
