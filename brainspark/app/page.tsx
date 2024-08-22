'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LightbulbIcon, RocketIcon, CheckCircleIcon, PlusIcon, PencilIcon } from 'lucide-react'
import { useSession } from "next-auth/react"
import Navbar from '@/components/navbar'
import Link from 'next/link'
import Image from 'next/image'
import { getIdeas, addIdea, updateIdeaStatus, updateIdea } from '@/actions/ideas'

interface IdeaDocument {
  _id: string;
  user: string;
  title: string;
  description: string;
  status: "new" | "inProgress" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

export default function IdeaTracker() {
  const [ideas, setIdeas] = useState<IdeaDocument[]>([])
  const [newIdea, setNewIdea] = useState({ title: '', description: '' })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<IdeaDocument | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      fetchIdeas()
    }
  }, [status])

  const fetchIdeas = async () => {
    try {
      const fetchedIdeas = await getIdeas()
      setIdeas(fetchedIdeas)
    } catch (error) {
      console.error('Failed to fetch ideas:', error)
    }
  }

  const handleAddIdea = async (formData: FormData) => {
    try {
      console.log("Inside")
      await addIdea(formData)
      setIsAddModalOpen(false)
      fetchIdeas()
    } catch (error) {
      console.error('Failed to add idea:', error)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const formData = new FormData()
    formData.append('id', id)
    formData.append('status', newStatus)
    try {
      await updateIdeaStatus(formData)
      fetchIdeas()
    } catch (error) {
      console.error('Failed to update idea status:', error)
    }
  }

  const handleUpdateIdea = async (formData: FormData) => {
    try {
      await updateIdea(formData)
      setSelectedIdea(null)
      setIsEditMode(false)
      fetchIdeas()
    } catch (error) {
      console.error('Failed to update idea:', error)
    }
  }

  const renderIdeaCard = (idea: IdeaDocument) => (
    <Card key={idea._id} className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center cursor-pointer" onClick={() => { setSelectedIdea(idea); setIsEditMode(false); }}>
          {idea.status === 'new' && <LightbulbIcon className="w-5 h-5 mr-2" />}
          {idea.status === 'inProgress' && <RocketIcon className="w-5 h-5 mr-2" />}
          {idea.status === 'completed' && <CheckCircleIcon className="w-5 h-5 mr-2" />}
          {idea.title}
        </CardTitle>
        <CardDescription>
          Created on {format(new Date(idea.createdAt), 'MM/dd/yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>{idea.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Badge className={
          idea.status === 'new' ? "bg-blue-500" :
            idea.status === 'inProgress' ? "bg-yellow-500" : "bg-green-500"
        }>
          {idea.status === 'new' ? "New" :
            idea.status === 'inProgress' ? "In Progress" : "Completed"}
        </Badge>
        <Select
          value={idea.status}
          onValueChange={(value) => handleUpdateStatus(idea._id, value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Change Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="inProgress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </CardFooter>
    </Card>
  )

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <>
      <Navbar />

      {status === "unauthenticated" ? (
        <section className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="container max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex justify-center lg:justify-end">
                <Image
                  src="/graphic_design.jpg"
                  alt="Hero"
                  width={960}
                  height={960}
                  className="aspect-square overflow-hidden rounded-xl object-cover object-center"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4 py-12 md:py-0 lg:py-0 xl:py-0">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Capture Your Brilliant Ideas
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Organize, track, and bring your ideas to life with our powerful Idea Tracker. Never let a great idea slip away again.
                  </p>
                </div>
                <Link href="/login" className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="container mx-auto p-4 max-w-4xl">
          <Button onClick={() => setIsAddModalOpen(true)} className="mb-6">
            <PlusIcon className="w-4 h-4 mr-2" />
            Add New Idea
          </Button>

          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Ideas</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              {ideas.map(renderIdeaCard)}
            </TabsContent>
            <TabsContent value="new">
              {ideas.filter(idea => idea.status === 'new').map(renderIdeaCard)}
            </TabsContent>
            <TabsContent value="inProgress">
              {ideas.filter(idea => idea.status === 'inProgress').map(renderIdeaCard)}
            </TabsContent>
            <TabsContent value="completed">
              {ideas.filter(idea => idea.status === 'completed').map(renderIdeaCard)}
            </TabsContent>
          </Tabs>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Idea</DialogTitle>
              </DialogHeader>
              <form action={handleAddIdea}>
                <div className="space-y-4 py-4">
                  <Input
                    name="title"
                    placeholder="Idea Title"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  />
                  <Textarea
                    name="description"
                    placeholder="Idea Description"
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Idea</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={!!selectedIdea} onOpenChange={() => { setSelectedIdea(null); setIsEditMode(false); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  {isEditMode ? "Edit Idea" : selectedIdea?.title}
                  {!isEditMode && (
                    <Button variant="outline" size="icon" onClick={() => setIsEditMode(true)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  )}
                </DialogTitle>
              </DialogHeader>
              {isEditMode ? (
                <form action={handleUpdateIdea}>
                  <input type="hidden" name="id" value={selectedIdea?._id} />
                  <div className="space-y-4 py-4">
                    <Input
                      name="title"
                      className="mb-4"
                      value={selectedIdea?.title}
                      onChange={(e) => setSelectedIdea((idea: IdeaDocument | null) => { return (idea ? { ...idea, title: e.target.value as string } : null) })}
                    />
                    <Textarea
                      name="description"
                      className="mb-4"
                      value={selectedIdea?.description}
                      onChange={(e) => setSelectedIdea((idea: IdeaDocument | null) => { return (idea ? { ...idea, description: e.target.value as string } : null) })}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Changes</Button>
                  </DialogFooter>
                </form>
              ) : (
                <div className="py-4">
                  <p>{selectedIdea?.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Status: {selectedIdea?.status}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Created on: {new Date(selectedIdea?.createdAt || '').toLocaleDateString()}
                  </p>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      )}
    </>
  )
}