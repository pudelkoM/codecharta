/*
 * Copyright (c) 2017, MaibornWolff GmbH
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * Neither the name of  nor the names of its contributors may be used to
 *    endorse or promote products derived from this software without specific
 *    prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

package de.maibornwolff.codecharta.model

import org.hamcrest.MatcherAssert.assertThat
import org.hamcrest.Matchers
import org.hamcrest.Matchers.hasSize
import org.jetbrains.spek.api.Spek
import org.jetbrains.spek.api.dsl.it

class ProjectBuilderTest : Spek({

    it("should create root node if not present") {
        // given
        val projectBuilder = ProjectBuilder("someName")
        val nodeForInsertion = MutableNode("someNode", NodeType.File)

        // when
        val project = projectBuilder.insertByPath(Path.trivialPath(), nodeForInsertion).build()

        // then
        val root = project.rootNode
        assertThat(root.children, hasSize(1))
        assertThat(root.children[0], NodeMatcher.matchesNode(nodeForInsertion.toNode()))
    }

    it("should use root node if present") {
        // given
        val root = MutableNode("root", NodeType.Folder)
        val projectBuilder = ProjectBuilder("someName", listOf(root))
        val nodeForInsertion = MutableNode("someNode", NodeType.File)

        // when
        val project = projectBuilder.insertByPath(Path.trivialPath(), nodeForInsertion).build()

        // then
        assertThat(project.rootNode, NodeMatcher.matchesNode(root.toNode()))
        assertThat(root.children, hasSize(1))
        assertThat(root.children[0], Matchers.`is`(nodeForInsertion))
    }
})