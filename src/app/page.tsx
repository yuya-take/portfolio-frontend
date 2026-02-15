"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Github, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";

const skillColors = {
  language: "bg-indigo-700",
  framework: "bg-purple-700",
  library: "bg-pink-700",
  other: "bg-gray-700",
};

const skillCategories = [
  {
    name: "フロントエンド",
    skills: [
      { name: "TypeScript", type: "language" },
      { name: "React", type: "library" },
      { name: "Next.js", type: "framework" },
      { name: "Vue.js", type: "framework" },
      { name: "Nuxt", type: "framework" },
      { name: "Svelte", type: "framework" },
      { name: "SvelteKit", type: "framework" },
      { name: "Tauri", type: "framework" },
      { name: "React Native", type: "framework" },
      { name: "Flutter", type: "framework" },
    ],
  },
  {
    name: "バックエンド",
    skills: [
      { name: "Rust", type: "language" },
      { name: "Python", type: "language" },
      { name: "Axum", type: "framework" },
      { name: "FastAPI", type: "framework" },
      { name: "Django", type: "framework" },
      { name: "REST API", type: "other" },
    ],
  },
  {
    name: "データベース",
    skills: [
      { name: "MySQL", type: "other" },
      { name: "PostgreSQL", type: "other" },
      { name: "DynamoDB", type: "other" },
    ],
  },
  {
    name: "DevOps",
    skills: [
      { name: "Docker", type: "other" },
      { name: "CI/CD", type: "other" },
      { name: "AWS", type: "other" },
      { name: "CloudFormation", type: "other" },
    ],
  },
  {
    name: "その他",
    skills: [
      { name: "Go", type: "language" },
      { name: "C++", type: "language" },
      { name: "kafka", type: "other" },
      { name: "EMQX", type: "other" },
    ],
  },
];

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [formData, setFormData] = useState({
    title: "",
    email: "",
    content: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "メッセージ送信完了",
          description: "お問い合わせありがとうございます。折り返しご連絡いたします。",
        });
        setFormData({ title: "", email: "", content: "" });
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      toast({
        title: "エラー",
        description: "メッセージの送信に失敗しました。後ほど再度お試しください。",
        variant: "destructive",
      });
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-gray-100">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-90 backdrop-blur-sm shadow-md">
        <ul className="flex justify-center space-x-6 py-4">
          {["home", "about me", "projects", "skills", "contact"].map((section) => (
            <li key={section}>
              <Button
                variant="ghost"
                onClick={() => scrollTo(section)}
                className={`text-sm uppercase tracking-wider transition-colors duration-300 ${
                  activeSection === section ? "text-purple-400 font-bold" : "text-gray-400 hover:text-purple-400"
                }`}
              >
                {section}
              </Button>
            </li>
          ))}
        </ul>
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Avatar className="w-40 h-40 mx-auto mb-6 border-4 border-purple-500 shadow-lg">
              <AvatarImage src="https://github.com/yuya-take.png" alt="Yuya Takemasa" />
              <AvatarFallback>YT</AvatarFallback>
            </Avatar>
          </motion.div>
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Yuya Takemasa
          </h1>
          <p className="text-2xl text-gray-300 mb-8">Full Stack Developer</p>
          <Button onClick={() => scrollTo("about me")} className="bg-purple-600 hover:bg-purple-700 text-white">
            詳しく見る
          </Button>
        </motion.div>
        <motion.div className="absolute inset-0 z-0" style={{ opacity }}>
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10"/ >
        </motion.div>
      </section>

      <section id="about me" className="py-20 px-4 flex items-center justify-center bg-gray-900 bg-opacity-60">
        <Card className="w-full max-w-3xl bg-gray-800 bg-opacity-80 backdrop-blur-md border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-4xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              About Me
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg text-gray-300">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-2 text-purple-400">Yuya.T</h3>
              <p className="mb-2">
                <span className="font-semibold">出身地:</span> 千葉県
              </p>
              <p className="mb-2">
                <span className="font-semibold">趣味:</span> ゴルフ・旅行（プロフィール写真はバングラディッシュ）
              </p>
              <p className="mb-2">
                <span className="font-semibold">最終学歴:</span> 千葉大学大学院 融合理工学府 先進理化学専攻 物理学コース
                修士課程修了
              </p>
            </div>
            <p className="mb-4">
              大学時代には、Pythonを使って実験装置を制御するプログラムを開発し、
              実験結果の分析やデータ処理を行うほか、必要に応じて回路設計も手がけるなど、
              ソフトウェアとハードウェアの両面で経験を積んできました。
              また、C++を用いたシミュレーションにより、実験結果と理想的な値との差を確認し、
              実験対象となる装置の校正を行うことにも取り組みました。
            </p>
            <p className="mb-4">
              その後、ITエンジニアとしてのキャリアをスタートし、フロントエンド・バックエンド、さらにはインフラまで幅広く対応しています。
              フロントエンドではReactやNext.jsを活用し、デザインと使いやすさを両立させたインターフェースを作成。
              バックエンドでは、RustやPythonを使ってスケーラブルなシステムの構築に取り組んでいます。
              また、DockerやCI/CDの仕組みを取り入れ、環境構築やデプロイの効率化にも注力しています。
            </p>
            <p>
              実務を通じてスキルを着実に磨きながら、プロジェクトに価値を提供できるよう日々努力しています。
              また新しい技術やアイデアに常にオープンで、チームと協力しながらより良い結果を追求することを心がけています。
              エンジニアとして技術を磨きつつ、プロジェクトに積極的に貢献する姿勢を持って取り組んでいます。
            </p>
          </CardContent>
        </Card>
      </section>

      <section id="projects" className="py-20 px-4 bg-gray-900 bg-opacity-60">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Projects
        </h2>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-md border-none shadow-xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-purple-400">ScoreScreen AI</CardTitle>
                <CardDescription className="text-gray-300 text-lg mt-2">
                  野球スコアブックをデジタル化し、AIがデータを分析するiOSアプリ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  「スコアをつける」から「スコアで戦う」へ。チーム管理・試合記録・AI分析を一つのアプリに統合し、チーム戦略と選手の成長をデータの力でサポートします。
                </p>
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-purple-300">主な機能</h4>
                  <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                    <li>チーム作成・選手登録・役割管理</li>
                    <li>試合作成からスコア入力・結果記録までのデジタル管理</li>
                    <li>AIによる試合データ自動解析・レポート生成・戦略提案</li>
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {["iOS", "AI", "スポーツテック"].map((tech) => (
                    <Badge key={tech} className="bg-purple-700 text-white text-xs">{tech}</Badge>
                  ))}
                </div>
                <div className="pt-4">
                  <a
                    href="https://scorescreen-ai-lp.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    ランディングページを見る
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section id="skills" className="py-20 px-4 bg-gray-900 bg-opacity-60 flex flex-col justify-center">
        <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Skills
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((category) => (
              <motion.div
              key={category.name}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800 bg-opacity-80 backdrop-blur-md border-none shadow-xl h-full">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-purple-400">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Badge
                        key={skill.name}
                        variant="secondary"
                        className={`${skillColors[skill.type as keyof typeof skillColors]} text-gray-100`}
                      >
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-10 px-4 flex items-center justify-center bg-gray-900 bg-opacity-60">
        <Card className="w-full max-w-md bg-gray-800 bg-opacity-80 backdrop-blur-md border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-gray-200 font-medium">
                  タイトル
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  placeholder="タイトルを入力してください"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-200 font-medium">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  placeholder="メールアドレスを入力してください"
                />
              </div>
              <div>
                <Label htmlFor="content" className="text-gray-200 font-medium">
                  内容
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  required
                  className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                  placeholder="お問い合わせ内容を入力してください"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
                disabled
              >
                送信
              </Button>
            </form>
            <div className="flex justify-center space-x-6 mt-6">
              <Button
                variant="outline"
                size="icon"
                asChild
                className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300"
              >
                <a href="https://github.com/yuya-take" target="_blank" rel="noopener noreferrer">
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                asChild
                className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-gray-900 transition-colors duration-300"
              >
                <a href="https://linkedin.com/in/yuya-takemasa-456763285" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
