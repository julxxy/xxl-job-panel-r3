'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx'
import FloatingInput from '@/components/FloatingInput'
import { Button } from 'antd'
import styles from '@/components/FloatingInput/index.module.css'

export default function ShadTabsExample() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [categories] = useState({
    recent: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
    popular: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
    ],
    trending: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  })

  const tabKeys = Object.keys(categories)

  return (
    <Tabs defaultValue={tabKeys[0]} className="w-full max-w-md py-16 px-2 items-center">
      <TabsList className="grid w-full grid-cols-3">
        {tabKeys.map(key => (
          <TabsTrigger key={key} value={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </TabsTrigger>
        ))}
      </TabsList>
      <div>
        <div className={styles.customForm}>
          <FloatingInput label="电子邮件地址" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          <FloatingInput label="密码" value={password} onChange={e => setPassword(e.target.value)} type="password" />
          <Button className={styles.customButton}>继续</Button>
        </div>
      </div>
      {tabKeys.map(key => (
        <TabsContent key={key} value={key} className="mt-4">
          <ul className="space-y-2">
            {categories[key as keyof typeof categories].map(post => (
              <li key={post.id} className="relative rounded-md p-4 border hover:bg-muted transition">
                <h3 className="text-sm font-medium">{post.title}</h3>
                <ul className="mt-1 flex space-x-1 text-xs text-muted-foreground">
                  <li>{post.date}</li>
                  <li>&middot;</li>
                  <li>{post.commentCount} comments</li>
                  <li>&middot;</li>
                  <li>{post.shareCount} shares</li>
                </ul>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  )
}
