
// "use client";

// import { useState } from 'react'
// import { format } from 'date-fns'
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { LightbulbIcon, RocketIcon, CheckCircleIcon, PlusIcon, PencilIcon } from 'lucide-react'
// import useSession from "next-auth/react";
// import Navbar from '@/components/navbar'

// type Idea = {
//   id: number;
//   title: string;
//   description: string;
//   status: 'new' | 'inProgress' | 'completed';
//   createdAt: Date;
// }


// export default function IdeaTracker() {
//   const [ideas, setIdeas] = useState<Idea[]>(dummyIdeas)
//   const [newIdea, setNewIdea] = useState({ title: '', description: '' })
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false)
//   const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const { status } = useSession();

//   const addIdea = () => {
//     if (newIdea.title.trim() !== '') {
//       setIdeas([
//         ...ideas,
//         {
//           id: Date.now(),
//           title: newIdea.title,
//           description: newIdea.description,
//           status: 'new',
//           createdAt: new Date(),
//         },
//       ])
//       setNewIdea({ title: '', description: '' })
//       setIsAddModalOpen(false)
//     }
//   }

//   const updateIdeaStatus = (id: number, newStatus: Idea['status']) => {
//     setIdeas(ideas.map(idea =>
//       idea.id === id ? { ...idea, status: newStatus } : idea
//     ))
//   }

//   const updateIdea = (updatedIdea: Idea) => {
//     setIdeas(ideas.map(idea =>
//       idea.id === updatedIdea.id ? updatedIdea : idea
//     ))
//     setSelectedIdea(null)
//     setIsEditMode(false)
//   }

//   const renderIdeaCard = (idea: Idea) => (
//     <Card key={idea.id} className="mb-4">
//       <CardHeader>
//         <CardTitle className="flex items-center cursor-pointer" onClick={() => { setSelectedIdea(idea); setIsEditMode(false); }}>
//           {idea.status === 'new' && <LightbulbIcon className="w-5 h-5 mr-2" />}
//           {idea.status === 'inProgress' && <RocketIcon className="w-5 h-5 mr-2" />}
//           {idea.status === 'completed' && <CheckCircleIcon className="w-5 h-5 mr-2" />}
//           {idea.title}
//         </CardTitle>
//         <CardDescription>
//           Created on {format(idea.createdAt, 'MM/dd/yyyy')}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <p>{idea.description}</p>
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Badge className={
//           idea.status === 'new' ? "bg-blue-500" :
//             idea.status === 'inProgress' ? "bg-yellow-500" : "bg-green-500"
//         }>
//           {idea.status === 'new' ? "New" :
//             idea.status === 'inProgress' ? "In Progress" : "Completed"}
//         </Badge>
//         <Select
//           value={idea.status}
//           onValueChange={(value: Idea['status']) => updateIdeaStatus(idea.id, value)}
//         >
//           <SelectTrigger className="w-[180px]">
//             <SelectValue placeholder="Change Status" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="new">New</SelectItem>
//             <SelectItem value="inProgress">In Progress</SelectItem>
//             <SelectItem value="completed">Completed</SelectItem>
//           </SelectContent>
//         </Select>
//       </CardFooter>
//     </Card>
//   )

//   return (
//     <>
//       <Navbar />

//       <div className="container mx-auto p-4 max-w-4xl">
//         <Button onClick={() => setIsAddModalOpen(true)} className="mb-6">
//           <PlusIcon className="w-4 h-4 mr-2" />
//           Add New Idea
//         </Button>

//         <Tabs defaultValue="all">
//           <TabsList className="mb-4">
//             <TabsTrigger value="all">All Ideas</TabsTrigger>
//             <TabsTrigger value="new">New</TabsTrigger>
//             <TabsTrigger value="inProgress">In Progress</TabsTrigger>
//             <TabsTrigger value="completed">Completed</TabsTrigger>
//           </TabsList>
//           <TabsContent value="all">
//             {ideas.map(renderIdeaCard)}
//           </TabsContent>
//           <TabsContent value="new">
//             {ideas.filter(idea => idea.status === 'new').map(renderIdeaCard)}
//           </TabsContent>
//           <TabsContent value="inProgress">
//             {ideas.filter(idea => idea.status === 'inProgress').map(renderIdeaCard)}
//           </TabsContent>
//           <TabsContent value="completed">
//             {ideas.filter(idea => idea.status === 'completed').map(renderIdeaCard)}
//           </TabsContent>
//         </Tabs>

//         <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Add New Idea</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <Input
//                 placeholder="Idea Title"
//                 value={newIdea.title}
//                 onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
//               />
//               <Textarea
//                 placeholder="Idea Description"
//                 value={newIdea.description}
//                 onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
//               />
//             </div>
//             <DialogFooter>
//               <Button onClick={addIdea}>Add Idea</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         <Dialog open={!!selectedIdea} onOpenChange={() => { setSelectedIdea(null); setIsEditMode(false); }}>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle className="flex justify-between items-center">
//                 {isEditMode ? "Edit Idea" : selectedIdea?.title}
//                 {!isEditMode && (
//                   <Button variant="outline" size="icon" onClick={() => setIsEditMode(true)}>
//                     <PencilIcon className="h-4 w-4" />
//                   </Button>
//                 )}
//               </DialogTitle>
//             </DialogHeader>
//             <div className="py-4">
//               {isEditMode ? (
//                 <>
//                   <Input
//                     className="mb-4"
//                     value={selectedIdea?.title}
//                     onChange={(e) => setSelectedIdea(idea => idea ? { ...idea, title: e.target.value } : null)}
//                   />
//                   <Textarea
//                     className="mb-4"
//                     value={selectedIdea?.description}
//                     onChange={(e) => setSelectedIdea(idea => idea ? { ...idea, description: e.target.value } : null)}
//                   />
//                 </>
//               ) : (
//                 <>
//                   <p>{selectedIdea?.description}</p>
//                   <p className="mt-2 text-sm text-muted-foreground">
//                     Status: {selectedIdea?.status}
//                   </p>
//                   <p className="text-sm text-muted-foreground">
//                     Created on: {selectedIdea?.createdAt.toLocaleDateString()}
//                   </p>
//                 </>
//               )}
//             </div>
//             <DialogFooter>
//               {isEditMode ? (
//                 <Button onClick={() => selectedIdea && updateIdea(selectedIdea)}>Save Changes</Button>
//               ) : (
//                 <Select
//                   value={selectedIdea?.status}
//                   onValueChange={(value: Idea['status']) => selectedIdea && updateIdeaStatus(selectedIdea.id, value)}
//                 >
//                   <SelectTrigger className="w-[180px]">
//                     <SelectValue placeholder="Change Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="new">New</SelectItem>
//                     <SelectItem value="inProgress">In Progress</SelectItem>
//                     <SelectItem value="completed">Completed</SelectItem>
//                   </SelectContent>
//                 </Select>
//               )}
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </>
//   )
// }